import { CopyPlus, Settings } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import React, { useState } from 'react';
import Image from 'next/image';
import MockDialog from './MockDialog';

const EmptyChat = ({
  sendMessage,
  focusMode,
  setFocusMode,
  optimizationMode,
  setOptimizationMode,
  vlmEnabled,
  setVlmEnabled,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  vlmEnabled: boolean;
  setVlmEnabled: (vlmEnable: boolean) => void;
}) => {
  // const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMockDialogOpen, setIsMockDialogOpen] = useState(false);

  return (
    <div className="relative">
      <MockDialog isOpen={isMockDialogOpen} setIsOpen={setIsMockDialogOpen} />
      {/*<SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />*/}
      <div className="absolute w-full flex flex-row items-center justify-end mr-5 mt-5">
        {/*<UploadS3Document className="cursor-pointer lg:hidden" />*/}
        <a
          href="http://158.160.68.33:3003/public/dashboard/57e69abe-defb-4f43-acc7-55bfb97ee071#theme=night"
          target="_blank"
        >
          <Settings
            // onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="cursor-pointer lg:hidden mr-[20px]"
          />
        </a>
        <CopyPlus
          onClick={() => setIsMockDialogOpen((prevState) => !prevState)}
          className="cursor-pointer lg:hidden"
        />
        {/*<CopyPlus*/}
        {/*  className="cursor-pointer lg:hidden"*/}
        {/*  onClick={() => setIsSettingsOpen(true)}*/}
        {/*/>*/}
      </div>
      <div className="flex flex-col items-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-8">
        <Image width={250} height={250} src="/mascot.png" alt="mascot" className="mt-10" />
        <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium -mt-8">
          Поиск начинается здесь.
        </h2>
        <EmptyChatMessageInput
          sendMessage={sendMessage}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          optimizationMode={optimizationMode}
          setOptimizationMode={setOptimizationMode}
          vlmEnabled={vlmEnabled}
          setVlmEnabled={setVlmEnabled}
        />
        <p
          // className="text-xs font-medium text-black dark:text-white !mt-2 self-end"
          className="text-xs font-medium !mt-2 self-end text-black/50 dark:text-white/50"
        >
          <span>разработано</span> <a
          href="https://airnd.ru"
          target="_blank"
          className="transition duration-200 hover:text-[#24A0ED] dark:hover:text-[#24A0ED]"
        >
          airnd.ru
        </a>
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;
