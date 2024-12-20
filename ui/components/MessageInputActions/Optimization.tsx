import { ChevronDown, Star, Zap, Cpu, Heart, Home, Search, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Fragment } from 'react';

export const OptimizationModes = [
  {
    key: '',
    title: 'Все категории',
    description: 'Поиск по всем категориям для комплексного анализа.',
    icon: <Search size={20} className="text-[#9E9E9E]" />,
  },
  {
    key: 'Реклама и связи с общественностью',
    title: 'Реклама и связи с общественностью',
    description: 'Инструменты и стратегии для успешной коммуникации и продвижения бренда.',
    icon: <Megaphone size={20} className="text-[#8BC34A]" />,
  },
  {
    key: 'Строительство и недвижимость',
    title: 'Строительство и недвижимость',
    description: 'Анализ и стратегии в области строительства и недвижимости.',
    icon: <Home size={20} className="text-[#3F51B5]" />,
  },
  {
    key: 'Телекоммуникации',
    title: 'Телекоммуникации',
    description: 'Современные коммуникации и сетевые технологии.',
    icon: <Zap size={20} className="text-[#FF9800]" />,
  },
  {
    key: 'Технологии и электроника',
    title: 'Технологии и электроника',
    description: 'Анализ инноваций и трендов в области технологий и электроники.',
    icon: <Cpu size={20} className="text-[#FF5722]" />,
  },
  {
    key: 'Фармацевтика и здравоохранение',
    title: 'Фармацевтика и здравоохранение',
    description: 'Исследования и стратегии для фармацевтических компаний и здравоохранения.',
    icon: <Heart size={20} className="text-[#E91E63]" />,
  },
  {
    key: 'Финансовые услуги',
    title: 'Финансовые услуги',
    description: 'Подробная аналитика и подходы для банков, страховых и финансовых компаний.',
    icon: (
      <Star
        size={16}
        className="text-[#2196F3] dark:text-[#BBDEFB] fill-[#BBDEFB] dark:fill-[#2196F3]"
      />
    ),
  },
];

const Optimization = ({
  optimizationMode,
  setOptimizationMode,
}: {
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
}) => {
  return (
    <Popover className="relative sm:w-full max-w-[15rem] md:max-w-md lg:max-w-lg">
      <PopoverButton
        type="button"
        className="p-2 text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:scale-95 transition duration-200 hover:text-black dark:hover:text-white"
      >
        <div className="flex flex-row items-center space-x-1">
          {/*{*/}
          {/*  OptimizationModes.find((mode) => mode.key === optimizationMode)*/}
          {/*    ?.icon*/}
          {/*}*/}
          <p className="text-xs font-medium">
            {
              OptimizationModes.find((mode) => mode.key === optimizationMode)
                ?.title
            }
          </p>
          <ChevronDown size={20} />
        </div>
      </PopoverButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel anchor="bottom end" className="md:!max-w-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-light-primary dark:bg-dark-primary border rounded-lg border-light-200 dark:border-dark-200 p-4">
            {OptimizationModes.map((mode, i) => (
              <PopoverButton
                onClick={() => setOptimizationMode(mode.key)}
                key={i}
                disabled={mode.key === 'quality'}
                className={cn(
                  'p-2 rounded-lg flex flex-col items-start justify-start text-start space-y-1 duration-200 cursor-pointer transition',
                  optimizationMode === mode.key
                    ? 'bg-light-secondary dark:bg-dark-secondary'
                    : 'hover:bg-light-secondary dark:hover:bg-dark-secondary',
                  mode.key === 'quality' && 'opacity-50 cursor-not-allowed',
                )}
              >
                <div className="flex flex-row items-center space-x-1 text-black dark:text-white">
                  <div>
                    {mode.icon}
                  </div>
                  <p className="text-sm font-medium">{mode.title}</p>
                </div>
                <p className="text-black/70 dark:text-white/70 text-xs">
                  {mode.description}
                </p>
              </PopoverButton>
            ))}
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default Optimization;
