/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
  TransitionChild,
  PopoverGroup,
} from '@headlessui/react';
import { File } from 'lucide-react';
import { Document } from '@langchain/core/documents';
import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import _ from 'lodash';

const MessageSources = ({ sources }: { sources: Document[] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHoverDialogOpen, setIsHoverDialogOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);

  const closeModal = () => {
    setIsDialogOpen(false);
    document.body.classList.remove('overflow-hidden-scrollable');
  };

  const openModal = () => {
    setIsDialogOpen(true);
    document.body.classList.add('overflow-hidden-scrollable');
  };

  const closeHoverModal = () => {
    setIsHoverDialogOpen(false);
    setCurrentItemIndex(-1);
  };

  const openHoverModal = (i: number) => () => {
    setIsHoverDialogOpen(true);
    setCurrentItemIndex(i);
  };

  return (
    <PopoverGroup className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {sources.slice(0, 3).map((source, i) => (
        <Popover
          key={i}
          onMouseEnter={openHoverModal(i)}
          onMouseLeave={closeHoverModal}
        >
          <PopoverButton
            as="div"
            className="bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 cursor-pointer rounded-lg p-3 font-medium"
          >
            <div className="flex overflow-hidden whitespace-nowrap">
              <img
                className="object-contain w-[48px] h-[27px]"
                width={48}
                height={27}
                src={source.metadata.thumbnail}
                alt=""
              />
              <p className="dark:text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis ml-2">
                {source.metadata.title}
              </p>
            </div>
            <div className="flex flex-row justify-end items-center space-x-1 text-black/50 dark:text-white/50 text-xs">
              <div className="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />
              <span>{i + 1}</span>
            </div>
          </PopoverButton>
          <CustomSource
            source={source}
            isHoverDialogOpen={isHoverDialogOpen}
            isCurrentItem={isHoverDialogOpen && currentItemIndex === i}
          />
        </Popover>
      ))}
      {sources.length > 3 && (
        <button
          onClick={openModal}
          className="bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 rounded-lg p-3 flex flex-col justify-center space-y-2 font-medium"
        >
          <p className="text-xs text-black/50 dark:text-white/50">
            Показать еще {sources.length - 3}
          </p>
        </button>
      )}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-200"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-screen-lg transform rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="text-lg font-medium leading-6 dark:text-white">
                    Источники
                  </DialogTitle>
                  <div className="grid grid-cols-2 gap-2 overflow-auto max-h-[500px] mt-2 pr-2">
                    {sources.map((source, i) => (
                      <a
                        className="bg-light-secondary hover:bg-light-200 dark:bg-dark-secondary dark:hover:bg-dark-200 border border-light-200 dark:border-dark-200 transition duration-200 rounded-lg p-3 space-y-2 font-medium"
                        key={i}
                        href={source.metadata.url}
                        target="_blank"
                      >
                        <FullTileContent idx={i} source={source} />
                      </a>
                    ))}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </PopoverGroup>
  );
};

const FullTileContent = ({ source, idx }: { source: Document, idx?: number }) => {
  return (
    <>
      <div className="flex">
        <img
          className="object-contain w-[70px] h-[39px]"
          width={70}
          height={39}
          src={source.metadata.thumbnail}
          alt=""
        />
        <div className="ml-2 space-y-2">
          <p className="dark:text-white text-xs">
            {source.metadata.title.slice(0, 100)}{source.metadata.title.length > 100 ? '...' : ''}
          </p>
          <p className="text-xs text-black/50 dark:text-white/50 max-w-md">
            {source?.pageContent?.slice(0, 100)}{source?.pageContent?.length > 100 ? '...' : ''}
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs">
          <Link
            onClick={(e) => e.stopPropagation()}
            href={`/?q=Сводка: ${source.metadata.file_name}`}
            className="cursor-pointer flex space-x-1 hover:text-white transition duration-200"
          >
            <File width={17} height={17} />
            <span className="hidden md:inline">Искать по файлу</span>
          </Link>
        </div>
        {!_.isNil(idx) && (
          <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs">
            <div className="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />
            <span>{idx + 1}</span>
          </div>
        )}
      </div>
    </>
  );
}

export const CustomSource = ({ isHoverDialogOpen, source, isCurrentItem = true }: {
  isHoverDialogOpen: boolean;
  source: Document;
  isCurrentItem?: boolean;
}) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-150"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
      show={isHoverDialogOpen && isCurrentItem}
    >
      <PopoverPanel
        anchor="bottom"
        static
        className="z-50 rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 px-6 py-3 text-left align-middle shadow-xl flex font-medium"
      >
        <a
          className="max-w-[300px] min-w-[230px] space-y-2"
          href={source.metadata.url}
          target="_blank"
        >
          <FullTileContent source={source} />
        </a>
      </PopoverPanel>
    </Transition>
  )
}

export default MessageSources;
