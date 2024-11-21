import express from 'express';
import logger from '../utils/logger';
import { allRequests, createSearchEmitter } from '../db/store'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router();

interface ChatModel {
  provider: string;
  model: string;
  customOpenAIBaseURL?: string;
  customOpenAIKey?: string;
}

interface SuggestionsBody {
  chatHistory: any[];
  chatModel?: ChatModel;
}

router.post('/', async (req, res) => {
  try {
    let body: SuggestionsBody = req.body;

    const chatHistory = body.chatHistory.map((msg: any) => {
      return [msg.role, msg.content]
    })

    const requestId = uuidv4()
    const emitter = createSearchEmitter(
      requestId,
      '',
      chatHistory,
      '',
      '',
      '',
      '',
    );

    emitter.on('end', (data) => {
      const parsedData = JSON.parse(data)
      res.status(200).json({ suggestions: parsedData.suggestions || [] });
      delete allRequests[requestId]
    })
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in generating suggestions: ${err.message}`);
  }
});

export default router;
