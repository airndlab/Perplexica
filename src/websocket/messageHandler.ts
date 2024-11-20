import { EventEmitter, WebSocket } from 'ws';
import handleWebSearch from '../agents/webSearchAgent';
import handleAcademicSearch from '../agents/academicSearchAgent';
import handleWritingAssistant from '../agents/writingAssistant';
import handleWolframAlphaSearch from '../agents/wolframAlphaSearchAgent';
import handleYoutubeSearch from '../agents/youtubeSearchAgent';
import handleRedditSearch from '../agents/redditSearchAgent';
import logger from '../utils/logger';
import db from '../db';
import { chats, messages as messagesSchema } from '../db/schema';
import { eq, asc, gt } from 'drizzle-orm';
import crypto from 'crypto';
import { createSearchEmitter } from '../db/store'
import { v4 as uuidv4 } from 'uuid'

type Message = {
  messageId: string;
  chatId: string;
  content: string;
};

type WSMessage = {
  category: string;
  space: string;
  filename: string;
  message: Message;
  optimizationMode: string;
  type: string;
  focusMode: string;
  history: Array<[string, string]>;
};

export const searchHandlers = {
  webSearch: handleWebSearch,
  academicSearch: handleAcademicSearch,
  writingAssistant: handleWritingAssistant,
  wolframAlphaSearch: handleWolframAlphaSearch,
  youtubeSearch: handleYoutubeSearch,
  redditSearch: handleRedditSearch,
};

const handleEmitterEvents = (
  emitter: EventEmitter,
  ws: WebSocket,
  messageId: string,
  chatId: string,
) => {
  let recievedMessage = '';
  let sources = [];

  emitter.on('end',  (data) => {
    const parsedData = JSON.parse(data)
    ws.send(
      JSON.stringify({
        type: 'all',
        message: parsedData.message,
        sources: parsedData.sources,
        messageId: messageId,
      }),
    );
    recievedMessage += parsedData.message;
    sources = parsedData.sources;

    ws.send(JSON.stringify({ type: 'messageEnd', messageId: messageId }));

    db.insert(messagesSchema)
      .values({
        content: recievedMessage,
        chatId: chatId,
        messageId: messageId,
        role: 'assistant',
        metadata: JSON.stringify({
          createdAt: new Date(),
          ...(sources && sources.length > 0 && { sources }),
        }),
      })
      .execute();
  });
  emitter.on('error', (data) => {
    const parsedData = JSON.parse(data);
    ws.send(
      JSON.stringify({
        type: 'error',
        data: parsedData.data,
        key: 'CHAIN_ERROR',
      }),
    );
  });
};

export const handleMessage = async (
  message: string,
  ws: WebSocket
) => {
  try {
    const parsedWSMessage = JSON.parse(message) as WSMessage;
    const parsedMessage = parsedWSMessage.message;

    const humanMessageId =
      parsedMessage.messageId ?? crypto.randomBytes(7).toString('hex');
    const aiMessageId = crypto.randomBytes(7).toString('hex');

    if (!parsedMessage.content)
      return ws.send(
        JSON.stringify({
          type: 'error',
          data: 'Invalid message format',
          key: 'INVALID_FORMAT',
        }),
      );

    if (parsedWSMessage.type === 'message') {
      const requestId = uuidv4()
      const emitter = createSearchEmitter(
        requestId,
        parsedMessage.content,
        parsedWSMessage.history,
        parsedWSMessage.category,
        parsedWSMessage.space,
        parsedWSMessage.filename,
      );

      handleEmitterEvents(emitter, ws, aiMessageId, parsedMessage.chatId);

      const chat = await db.query.chats.findFirst({
        where: eq(chats.id, parsedMessage.chatId),
      });

      if (!chat) {
        await db
          .insert(chats)
          .values({
            id: parsedMessage.chatId,
            title: parsedMessage.content,
            createdAt: new Date().toString(),
            focusMode: parsedWSMessage.focusMode,
            category: parsedWSMessage.category,
            space: parsedWSMessage.space,
            filename: parsedWSMessage.filename,
          })
          .execute();
      }

      const messageExists = await db.query.messages.findFirst({
        where: eq(messagesSchema.messageId, humanMessageId),
      });

      if (!messageExists) {
        await db
          .insert(messagesSchema)
          .values({
            content: parsedMessage.content,
            chatId: parsedMessage.chatId,
            messageId: humanMessageId,
            role: 'user',
            metadata: JSON.stringify({
              createdAt: new Date(),
            }),
          })
          .execute();
      } else {
        await db
          .delete(messagesSchema)
          .where(gt(messagesSchema.id, messageExists.id))
          .execute();
      }
    }
  } catch (err) {
    ws.send(
      JSON.stringify({
        type: 'error',
        data: 'Invalid message format',
        key: 'INVALID_FORMAT',
      }),
    );
    logger.error(`Failed to handle message: ${err}`);
  }
};
