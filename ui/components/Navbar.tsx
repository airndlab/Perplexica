import { Clock, Edit, Share } from 'lucide-react';
import { Message } from './ChatWindow';
import { ElementType, Fragment, useEffect, useState } from 'react';
import { formatTimeDifference } from '@/lib/utils';
import DeleteChat from './DeleteChat';
import { Popover, PopoverButton, PopoverGroup, PopoverPanel, Transition } from '@headlessui/react';
import _ from 'lodash';

interface ITag {
  title: string;
  Icon: ElementType;
}

const TAGS: ITag[] = [
  {
    title: 'Транспорт',
    Icon: Clock,
  },
  {
    title: 'Маркетиноговые исследования',
    Icon: Edit,
  },
]

const Navbar = ({
  chatId,
  messages,
}: {
  messages: Message[];
  chatId: string;
}) => {
  const [title, setTitle] = useState<string>('');
  const [timeAgo, setTimeAgo] = useState<string>('');

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
      <div className="flex items-center">
        <PopoverGroup className="flex pr-2">
          {_.map(TAGS, (tag, idx) => (
            <PopoverTags key={idx} tag={tag} />
          ))}
        </PopoverGroup>
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

const PopoverTags = ({ tag }: { tag: ITag }) => {
  const { title, Icon } = tag;
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
        <Icon size={17} />
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
          className="z-40 rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 px-6 py-3 text-left align-middle shadow-xl flex font-medium"
        >
          {title}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}

export default Navbar;
