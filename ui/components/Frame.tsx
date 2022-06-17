import React from 'react';

import { Story } from '../store/types';
import { CopyIcon, GlobeIcon, LinkIcon } from './Icons';

interface FrameProps {
  story?: Story;
  url?: string;
  className?: string;
}

export const Frame = ({ className, url, story }: FrameProps) => {
  return (
    <article
      className="flex-1 border-r-2 border-orange-800 border-opacity-20 mr-72"
      style={{
        height: "calc(100vh - 32px)",
        marginTop: 32,
      }}
    >
      <div
        className="z-30 fixed left-0 bottom-0 mx-3 my-2 flex items-center space-x-2"
        style={{
          width: "calc(100vw - 300px)",
          maxWidth: "calc(100vw - 300px)",
        }}
      >
        <Item className="flex-1">
          <div className="flex-1 flex items-center space-x-2">
            <span className="uppercase opacity-80">
              <GlobeIcon />
            </span>
            <span className="inline-block text-owhite break-all overflow-hidden max-h-4 w-full pr-4">
              {story?.url || ""}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <a
              className="text-owhite hover:text-orange-400 cursor-pointer"
              onClick={() => copyText(story?.url ?? "")}
              title="Copy link"
            >
              <CopyIcon />
            </a>
            <div className="opacity-50">|</div>
            <a
              className="text-owhite hover:text-orange-400"
              href={story?.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
            >
              <LinkIcon />
            </a>
          </div>
        </Item>
        <Item className="flex-0">
          <span className="opacity-80 font-bold mr-1">HN</span>
          <a
            className="flex items-center space-x-2 text-owhite hover:text-orange-400"
            href={`https://news.ycombinator.com/item?id=${story?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View in HN"
          >
            <span className="uppercase opacity-80">Score</span>
            <span className="font-bold">{story?.score}</span>
          </a>
          <div className="opacity-50">|</div>
          <a
            className="flex items-center space-x-2 hover:text-orange-400"
            href={`https://news.ycombinator.com/item?id=${story?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Comments"
          >
            <span className="uppercase opacity-80">Comments</span>
            <span className="font-bold">{story?.descendants}</span>
          </a>
        </Item>
        <div className="p-1"></div>
      </div>
      <iframe
        className={`${className} w-full h-full border-none p-0 m-0 `}
        src={url}
        title="description"
      ></iframe>
    </article>
  );
};

interface ItemProps {
  children: React.ReactNode;
  className?: string;
}

const Item = ({ children, className }: ItemProps) => {
  return (
    <div
      className={`${className} backdrop-blur bg-black bg-opacity-70 border border-white border-opacity-40 text-owhite rounded-md px-3 py-2 font-mono fontLight text-xs flex items-center space-x-2`}
      style={{
        filter: "drop-shadow(0 2px 1px rgba(196, 131, 110, 0.1))",
      }}
    >
      {children}
    </div>
  );
};

function copyText(copyText: string) {
  navigator.clipboard.writeText(copyText);
}
