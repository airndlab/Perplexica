import React from 'react';
import _ from 'lodash';
import { Search } from 'lucide-react';
import { Document } from '@langchain/core/documents';

const FullTileContent = ({ source, idx }: { source: Document, idx?: number }) => {
  return (
    <>
      <div className="flex">
        <img
          className="object-contain w-[150px] h-[84px]"
          width={150}
          height={84}
          src={source?.metadata?.thumbnail}
          alt=""
        />
        <div className="ml-2 space-y-2">
          <p className="dark:text-white text-xs">
            {source?.metadata?.title?.slice(0, 100)}{source?.metadata?.title?.length > 100 ? '...' : ''}
          </p>
          <p className="text-xs text-black/50 dark:text-white/50 max-w-md">
            {source?.pageContent?.slice(0, 100)}{source?.pageContent?.length > 100 ? '...' : ''}
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <div className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs">
          <a
            onClick={(e) => e.stopPropagation()}
            href={`/?q=Сводка: ${source?.metadata?.file_name}`}
            className="cursor-pointer flex space-x-1 hover:text-white transition duration-200"
          >
            <Search width={17} height={17} />
            <span className="hidden md:inline">Искать по файлу</span>
          </a>
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
};

export default FullTileContent;
