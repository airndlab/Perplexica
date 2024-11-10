import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const formatTimeDifference = (
  date1: Date | string,
  date2: Date | string,
): string => {
  date1 = new Date(date1);
  date2 = new Date(date2);

  const diffInSeconds = Math.floor(
    Math.abs(date2.getTime() - date1.getTime()) / 1000,
  );

  if (diffInSeconds < 60)
    return `${diffInSeconds} сек.${diffInSeconds !== 1 ? '' : ''}`;
  else if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} мин.${Math.floor(diffInSeconds / 60) !== 1 ? '' : ''}`;
  else if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} ч.${Math.floor(diffInSeconds / 3600) !== 1 ? '' : ''}`;
  else if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 86400)} д.${Math.floor(diffInSeconds / 86400) !== 1 ? '' : ''}`;
  else
    return `${Math.floor(diffInSeconds / 31536000)} г.${Math.floor(diffInSeconds / 31536000) !== 1 ? '' : ''}`;
};
