import { Clock, Edit, Share } from 'lucide-react';
import { Message } from './ChatWindow';
import { Fragment, useEffect, useMemo, useState, ReactNode } from 'react';
import { formatTimeDifference } from '@/lib/utils';
import DeleteChat from './DeleteChat';
import { Popover, PopoverButton, PopoverGroup, PopoverPanel, Transition } from '@headlessui/react';
import _ from 'lodash';
import { focusModes } from '@/components/MessageInputActions/Focus';
import { OptimizationModes } from '@/components/MessageInputActions/Optimization';

const Navbar = ({
  chatId,
  messages,
  focusMode,
  optimizationMode,
}: {
  messages: Message[];
  chatId: string;
  focusMode: string;
  optimizationMode: string;
}) => {
  const [title, setTitle] = useState<string>('');
  const [timeAgo, setTimeAgo] = useState<string>('');

  const tags = useMemo((): ITag[] => {
    const currentFocusMode = _.find(focusModes, ['key', focusMode]);
    const currentOptimizationMode = _.find(OptimizationModes, ['key', optimizationMode]);
    if (currentFocusMode && currentOptimizationMode) {
      return [
        currentFocusMode,
        currentOptimizationMode
      ];
    }
    return [];
  }, [focusMode, optimizationMode]);

  useEffect(() => {
    if (messages.length > 0) {
      const newTitle =
        messages[0].content.length > 20
          ? `${messages[0].content.substring(0, 20).trim()}...`
          : messages[0].content;
      setTitle(newTitle);
      const newTimeAgo = formatTimeDifference(
        new Date(),
        messages[0].createdAt,
      );
      setTimeAgo(newTimeAgo);
    }
  }, [messages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messages.length > 0) {
        const newTimeAgo = formatTimeDifference(
          new Date(),
          messages[0].createdAt,
        );
        setTimeAgo(newTimeAgo);
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed z-40 top-0 left-0 right-0 px-4 lg:pl-[104px] lg:pr-6 lg:px-8 flex flex-row items-center justify-between w-full py-4 text-sm text-black dark:text-white/70 border-b bg-light-primary dark:bg-dark-primary border-light-100 dark:border-dark-200">
      <a
        href="/"
        className="active:scale-95 transition duration-100 cursor-pointer lg:hidden"
      >
        <Edit size={17} />
      </a>
      <div className="hidden lg:flex flex-row items-center justify-center space-x-2">
        <Clock size={17} />
        <p className="text-xs">{timeAgo} назад</p>
      </div>
      <div className="flex items-center space-x-2">
        {!_.isEmpty(tags) && !_.startsWith(title, 'Сводка:') && (
          <PopoverGroup className="flex space-x-2">
            {_.map(tags, (tag, idx) => (
              <PopoverTags key={idx} tag={tag} />
            ))}
          </PopoverGroup>
        )}
        <p className="hidden lg:flex">{title}</p>
      </div>
      <div className="flex flex-row items-center space-x-4">
        <Share
          size={17}
          className="active:scale-95 transition duration-100 cursor-pointer"
        />
        <DeleteChat redirect chatId={chatId} chats={[]} setChats={() => {}} />
      </div>
    </div>
  );
};

interface ITag {
  title: string;
  description: string;
  icon: ReactNode;
}

const PopoverTags = ({ tag }: { tag: ITag }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <PopoverButton
        as="p"
        className="cursor-pointer p-2 rounded-xl bg-light-secondary dark:bg-dark-secondary text-black dark:text-white"
      >
        {tag.icon}
      </PopoverButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
        show={open}
      >
        <PopoverPanel
          anchor="bottom"
          static
          className="z-40 !max-w-[300px] p-2 rounded-lg flex flex-col items-start justify-start text-start space-y-2 duration-200 transition bg-light-secondary dark:bg-dark-secondary"
        >
            <div
              className="flex flex-row items-center space-x-2 text-[#24A0ED]"
            >
              <div>
                {tag.icon}
              </div>
              <p className="text-sm font-medium">{tag.title}</p>
            </div>
            <p className="text-black/70 dark:text-white/70 text-xs">
              {tag.description}
            </p>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}

export default Navbar;
