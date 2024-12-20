'use client';

import { cn } from '@/lib/utils';
import { BookOpenText, SquarePen, CopyPlus, Settings, Aperture } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from './Layout';
import MockDialog from './MockDialog';
import Tooltip from '@/components/Tooltip';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  // const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMockDialogOpen, setIsMockDialogOpen] = useState(false);

  const navLinks = [
    {
      icon: SquarePen,
      href: '/',
      active: segments.length === 0 || segments.includes('c'),
      label: 'Чат',
    },
    {
      icon: BookOpenText,
      href: '/library',
      active: segments.includes('library'),
      label: 'История',
    },
  ];

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto bg-light-secondary dark:bg-dark-secondary px-2 py-8">
          <Tooltip title="Исследования" placement="right">
            <Link href="/discover" className="flex justify-center">
              <Aperture className="cursor-pointer" />
            </Link>
          </Tooltip>
          <VerticalIconContainer>
            {navLinks.map((link, i) => {
              const CurrentLink = link.href === '/' ? 'a' : Link;
              return (
                <Tooltip
                  key={i}
                  title={link.label}
                  placement="right"
                >
                  <CurrentLink
                    href={link.href}
                    className={cn(
                      'relative flex flex-row items-center justify-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 duration-150 transition w-full py-2 rounded-lg',
                      link.active
                        ? 'text-black dark:text-white'
                        : 'text-black/70 dark:text-white/70',
                    )}
                  >
                    <link.icon />
                    {link.active && (
                      <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white" />
                    )}
                  </CurrentLink>
                </Tooltip>
              )
            })}
          </VerticalIconContainer>

          <div className="space-y-7 w-full">
            <div>
              <Tooltip title="Админ-панель" placement="right">
                <a
                  href="http://158.160.68.33:3003/public/dashboard/57e69abe-defb-4f43-acc7-55bfb97ee071#theme=night"
                  target="_blank"
                  className="flex justify-center"
                >
                  <Settings
                    // onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="cursor-pointer"
                  />
                </a>
              </Tooltip>
            </div>

            <div>
              <Tooltip title="Добавить файл" placement="right">
                <div className="flex justify-center">
                  <CopyPlus
                    onClick={() => setIsMockDialogOpen((prevState) => !prevState)}
                    className="cursor-pointer"
                  />
                </div>
              </Tooltip>
            </div>
            {/*<UploadS3Document className="cursor-pointer mt-[30px]" />*/}
          </div>


          {/*<CopyPlus*/}
          {/*  onClick={() => setIsSettingsOpen(!isSettingsOpen)}*/}
          {/*  className="cursor-pointer"*/}
          {/*/>*/}

          {/*<SettingsDialog*/}
          {/*  isOpen={isSettingsOpen}*/}
          {/*  setIsOpen={setIsSettingsOpen}*/}
          {/*/>*/}
          <MockDialog
            isOpen={isMockDialogOpen}
            setIsOpen={setIsMockDialogOpen}
          />
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-light-primary dark:bg-dark-primary px-4 py-4 shadow-sm lg:hidden">
        {navLinks.map((link, i) => {
          const CurrentLink = link.href === '/' ? 'a' : Link;

          return (
            <CurrentLink
              href={link.href}
              key={i}
              className={cn(
                'relative flex flex-col items-center space-y-1 text-center w-full',
                link.active
                  ? 'text-black dark:text-white'
                  : 'text-black dark:text-white/70',
              )}
            >
              {link.active && (
                <div className="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-black dark:bg-white" />
              )}
              <link.icon />
              <p className="text-xs">{link.label}</p>
            </CurrentLink>
          )
        })}
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
