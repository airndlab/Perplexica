import React, { forwardRef, Fragment, ReactNode, useMemo, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

const MyCustomButton = forwardRef(({ className, children }: any, ref: any) => {
  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
});

MyCustomButton.displayName = 'MyCustomButton';

const Tooltip = ({
  children,
  title,
  placement = 'bottom',
  inline,
}: {
  children: ReactNode;
  title?: ReactNode;
  placement?: string;
  inline?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openTooltip = () => {
    setIsOpen(true);
  };

  const closeTooltip = () => {
    setIsOpen(false);
  };

  const anchor = useMemo(
    () => ({
      to: placement,
      gap: '8px',
    }),
    [placement],
  );

  return (
    <Popover
      as="span"
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      className="w-full"
    >
      <PopoverButton
        as={MyCustomButton}
        className={cn(inline ? '' : 'block w-full')}
      >
        {children}
      </PopoverButton>
      {title && (
        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
          show={isOpen}
        >
          <PopoverPanel
            // @ts-ignore
            anchor={anchor}
            static
            className="z-50 rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 px-6 py-3 text-left align-middle shadow-xl flex font-medium"
          >
            {title}
          </PopoverPanel>
        </Transition>
      )}
    </Popover>
  );
};

export default Tooltip;
