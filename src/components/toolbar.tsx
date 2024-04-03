'use client';
import React from 'react';
import { Icon } from './icons';
import { cn } from '@/cn';
import { useStore } from '@tanstack/react-store';
import { globalStore } from '@/global-store';
import { useStory } from '@/hooks/use-story';

type ItemProps = {
  children: React.ReactNode;
  className?: string;
};

const Item = ({ children, className }: ItemProps) => {
  return (
    <div
      className={cn(
        'backdrop-blur bg-black bg-opacity-70 border border-white border-opacity-40 text-owhite rounded-md px-3 py-2 font-mono font-light text-xs flex items-center space-x-2',
        className,
      )}
      style={{
        filter: 'drop-shadow(0 2px 1px rgba(196, 131, 110, 0.1))',
      }}
    >
      {children}
    </div>
  );
};

export const Toolbar = () => {
  const { data: story, refetch } = useStory();
  const sidebarOpen = useStore(globalStore, (s) => s.sidebarOpen);
  return (
    <menu
      className={cn(
        'z-30 fixed left-0 bottom-0 mx-3 my-2 flex justify-between lg:justify-start items-center space-x-2',
        'w-[calc(100dvw-24px)] max-w-[calc(100dvw-24px)]',
        'lg:w-[calc(100dvw-316px)] lg:max-w-[calc(100dvw-316px)]',
      )}
    >
      <Item className="flex-0 lg:flex-1 hidden lg:flex">
        <div className="flex-0 lg:flex-1 flex items-center space-x-2">
          <span className="uppercase opacity-80">
            <Icon name="globe" />
          </span>
          <span className="hidden lg:inline-block text-owhite break-all overflow-hidden max-h-4 w-full pr-4">
            {story?.url || ''}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className={cn(
              'hidden lg:inline-block text-owhite cursor-pointer',
              story?.url ? 'hover:text-orange-400' : 'text-gray-500',
            )}
            onClick={() => navigator.clipboard.writeText(story?.url ?? '')}
            title="Copy link"
            aria-label="Copy link to clipboard"
            disabled={!story?.url}
          >
            <Icon name="copy" className="active:scale-90" />
          </button>
          <div className="hidden lg:inline-block opacity-50">|</div>
          <a
            className="text-owhite hover:text-orange-400"
            href={story?.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            aria-label="Open story in new tab"
          >
            <Icon name="link" />
          </a>
          <div className="opacity-50">|</div>
          <a
            className="text-owhite hover:text-orange-400"
            href={`https://twitter.com/share?text=${story?.title + '%0a%0a-'}&url=${
              story?.url
            }%0a%0a(discovered via https://rand.hn powered by @AxiomFM)`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share this page"
          >
            <Icon name="tweet" />
          </a>
        </div>
      </Item>
      <Item className="flex-0">
        <span className="hidden lg:block opacity-80 font-bold">HN</span>
        <a
          className="flex flex-col-reverse lg:flex-row items-center lg:space-x-2 text-owhite hover:text-orange-400"
          href={`https://news.ycombinator.com/item?id=${story?.id}`}
          title="View in HN"
          aria-label="View Hacker News thread"
        >
          <span className="uppercase opacity-80">Score</span>
          <span className="font-bold">{story?.score}</span>
        </a>
        <div className="opacity-50">|</div>
        <a
          className="flex flex-col-reverse lg:flex-row items-center lg:space-x-2 hover:text-orange-400"
          href={`https://news.ycombinator.com/item?id=${story?.id}`}
          title="View Comments"
          aria-label="View story comments"
        >
          <span className="uppercase opacity-80">Comments</span>
          <span className="font-bold">{story?.descendants}</span>
        </a>
      </Item>
      <Item className="flex-0 block lg:hidden flex flex-row">
        <button className="flex items-center" title="Next story" aria-label="Next story" onClick={() => void refetch()}>
          <span className="font-semibold uppercase">Next Story</span>
        </button>
        <div className="opacity-50">|</div>
        <button
          className={cn('flex items-center', sidebarOpen ? 'text-orange-500' : 'text-owhite')}
          title="View sidebar"
          aria-label="View sidebar"
          onClick={() => void globalStore.setState((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))}
        >
          <Icon name="menu" />
        </button>
      </Item>
    </menu>
  );
};
