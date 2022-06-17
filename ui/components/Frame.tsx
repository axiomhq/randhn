import React from 'react';

import { Story } from '../store/types';

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
        className="z-50 fixed left-0 bottom-0 mx-3 my-2 flex items-center space-x-2 bg-orange-200"
        style={{
          width: "calc(100vw - 300px)",
          maxWidth: "calc(100vw - 300px)",
        }}
      >
        <Item className="flex-1">
          <div className="flex-1 flex items-center space-x-2">
            <span className="uppercase opacity-80">
              <svg width="1rem" height="1rem" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="7.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                ></circle>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15.25 12C15.25 16.5 13.2426 19.25 12 19.25C10.7574 19.25 8.75 16.5 8.75 12C8.75 7.5 10.7574 4.75 12 4.75C13.2426 4.75 15.25 7.5 15.25 12Z"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M5 12H12H19"
                ></path>
              </svg>
            </span>
            <div className="inline-block text-owhite text-ellipsis overflow-hidden whitespace-nowrap">
              {story?.url || ""}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a
              className="text-owhite hover:text-orange-400"
              onClick={() => copyText(story?.url ?? "")}
              title="Copy link"
            >
              <svg width="1rem" height="1rem" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6.5 15.25V15.25C5.5335 15.25 4.75 14.4665 4.75 13.5V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H13.5C14.4665 4.75 15.25 5.5335 15.25 6.5V6.5"
                ></path>
                <rect
                  width="10.5"
                  height="10.5"
                  x="8.75"
                  y="8.75"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  rx="2"
                ></rect>
              </svg>
            </a>
            <div className="opacity-50">|</div>
            <a
              className="text-owhite hover:text-orange-400"
              href={story?.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
            >
              <svg width="1rem" height="1rem" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V14.75"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19.25 9.25V4.75H14.75"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 5L11.75 12.25"
                ></path>
              </svg>
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
      className={`${className} backdrop-blur bg-black bg-opacity-70 text-owhite rounded-md px-3 py-2 font-mono fontLight text-xs flex items-center space-x-2`}
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
