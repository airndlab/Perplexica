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
import { Fragment, useState } from 'react';
import Link from 'next/link';

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
            as="span"
            className="relative bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 cursor-pointer rounded-lg p-3 flex items-start font-medium"
          >
            <img
              className="object-contain"
              width={48}
              height={48}
              src={source.metadata.thumbnail}
              alt=""
            />
            <p className="dark:text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis ml-2">
              {source.metadata.title}
            </p>
            <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs absolute right-[7px] bottom-[7px]">
              <div className="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />
              <span>{i + 1}</span>
            </div>
            {/*<div className="flex flex-col space-y-2 ml-2">*/}
            {/*  <div className="flex flex-row items-center justify-between">*/}
            {/*    <div className="flex flex-row items-center space-x-1">*/}
            {/*      <img*/}
            {/*        src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`}*/}
            {/*        width={16}*/}
            {/*        height={16}*/}
            {/*        alt="favicon"*/}
            {/*        className="rounded-lg h-4 w-4"*/}
            {/*      />*/}
            {/*      <p className="text-xs text-black/50 dark:text-white/50 overflow-hidden whitespace-nowrap text-ellipsis">*/}
            {/*        {source.metadata.url.replace(/.+\/\/|www.|\..+/g, '')}*/}
            {/*      </p>*/}
            {/*    </div>*/}
            {/*    <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs">*/}
            {/*      <div className="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />*/}
            {/*      <span>{i + 1}</span>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </PopoverButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            show={isHoverDialogOpen && currentItemIndex === i}
          >
            <PopoverPanel
              anchor="bottom"
              static
              className="rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 px-6 py-3 text-left align-middle shadow-xl flex font-medium"
            >
              {/*<div className="flex flex-row items-center space-x-1">*/}
              {/*<img*/}
              {/*  src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`}*/}
              {/*  width={16}*/}
              {/*  height={16}*/}
              {/*  alt="favicon"*/}
              {/*  className="rounded-lg h-4 w-4"*/}
              {/*/>*/}
              {/*<p className="text-xs text-black/50 dark:text-white/50 overflow-hidden whitespace-nowrap text-ellipsis">*/}
              {/*  {source.metadata.url.replace(/.+\/\/|www.|\..+/g, '')}*/}
              {/*</p>*/}
              {/*</div>*/}
              <img
                className="object-contain"
                width={70}
                height={70}
                src={source.metadata.thumbnail}
                alt=""
              />
              <a
                className="max-w-[300px] ml-2 text-black dark:text-white text-sm overflow-hidden transition duration-200 hover:text-[#24A0ED] dark:hover:text-[#24A0ED] cursor-pointer"
                href={source.metadata.url}
                target="_blank"
              >
                {source.metadata.title}
              </a>
              <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs absolute right-[7px] bottom-[7px]">
                <Link
                  href={`/?q=Сводка: ${source.metadata.file_name}`}
                  className="cursor-pointer hover:text-white transition duration-200"
                >
                  <File width={15} height={15} className="" />
                </Link>
                {/*<div className="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />*/}
                {/*<span>{i + 1}</span>*/}
              </div>
              {/*<p className="text-xs text-black/50 dark:text-white/50 max-w-md">*/}
              {/*  {source.pageContent}*/}
              {/*</p>*/}
            </PopoverPanel>
          </Transition>
        </Popover>
      ))}
      {sources.length > 3 && (
        <button
          onClick={openModal}
          className="bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
        >
          <div className="flex flex-row items-center space-x-1">
            {sources.slice(3, 6).map((source, i) => (
              <img
                src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`}
                width={16}
                height={16}
                alt="favicon"
                className="rounded-lg h-4 w-4"
                key={i}
              />
            ))}
          </div>
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
                        className="relative bg-light-secondary hover:bg-light-200 dark:bg-dark-secondary dark:hover:bg-dark-200 border border-light-200 dark:border-dark-200 transition duration-200 rounded-lg p-3 flex space-y-2 font-medium"
                        key={i}
                        href={source.metadata.url}
                        target="_blank"
                      >
                        <img
                          className="object-contain"
                          width={70}
                          height={70}
                          src={source.metadata.thumbnail}
                          alt=""
                        />
                        <p className="dark:text-white text-xs ml-2">
                          {source.metadata.title}
                        </p>
                        <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs absolute right-[7px] bottom-[7px]">
                          <div className="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />
                          <span>{i + 1}</span>
                        </div>
                        <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs absolute right-[23px] bottom-[7px]">
                          <Link
                            onClick={(e) => e.stopPropagation()}
                            href={`/?q=Сводка: ${source.metadata.file_name}`}
                            className="cursor-pointer hover:text-white transition duration-200"
                          >
                            <File width={15} height={15} className="" />
                          </Link>
                          {/*<div className="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />*/}
                          {/*<span>{i + 1}</span>*/}
                        </div>
                        {/*<div className="flex flex-row items-center justify-between">*/}
                        {/*  <div className="flex flex-row items-center space-x-1">*/}
                        {/*    <img*/}
                        {/*      src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`}*/}
                        {/*      width={16}*/}
                        {/*      height={16}*/}
                        {/*      alt="favicon"*/}
                        {/*      className="rounded-lg h-4 w-4"*/}
                        {/*    />*/}
                        {/*    <p className="text-xs text-black/50 dark:text-white/50 overflow-hidden whitespace-nowrap text-ellipsis">*/}
                        {/*      {source.metadata.url.replace(*/}
                        {/*        /.+\/\/|www.|\..+/g,*/}
                        {/*        '',*/}
                        {/*      )}*/}
                        {/*    </p>*/}
                        {/*  </div>*/}
                        {/*  <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs">*/}
                        {/*    <div className="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />*/}
                        {/*    <span>{i + 1}</span>*/}
                        {/*  </div>*/}
                        {/*</div>*/}
                        {/*<p className="text-xs dark:text-white">*/}
                        {/*  {source.pageContent}*/}
                        {/*</p>*/}
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

export default MessageSources;
