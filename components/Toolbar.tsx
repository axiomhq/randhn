import classNames from "classnames";
import React from "react";

import { LoadStoryFunc, Story, StoryKind } from "../store/types";
import { copyText } from "../util";
import { CopyIcon, GlobeIcon, LinkIcon, MenuIcon, TweetIcon } from "./Icons";
import styles from "./Toolbar.module.css";

interface ToolbarProps {
  story?: Story;
  url?: string;
  className?: string;
  loadStory: LoadStoryFunc;
  kind: StoryKind;
  toggleSidebar: () => void;
  sidebarShowing: boolean;
}

export const Toolbar = ({
  story,
  loadStory,
  kind,
  toggleSidebar,
  sidebarShowing,
}: ToolbarProps) => {
  return (
    <menu
      className={classNames(
        styles.root,
        "z-30 fixed left-0 bottom-0 mx-3 my-2 flex justify-between lg:justify-start items-center space-x-2",
      )}
    >
      <Item className="flex-0 lg:flex-1 hidden lg:flex">
        <div className="flex-0 lg:flex-1 flex items-center space-x-2">
          <span className="uppercase opacity-80">
            <GlobeIcon />
          </span>
          <span className="hidden lg:inline-block text-owhite break-all overflow-hidden max-h-4 w-full pr-4">
            {story?.url || ""}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <a
            className="hidden lg:inline-block text-owhite hover:text-orange-400 cursor-pointer"
            onClick={() => copyText(story?.url ?? "")}
            title="Copy link"
            aria-label="Copy link to clipboard"
          >
            <CopyIcon />
          </a>
          <div className="hidden lg:inline-block opacity-50">|</div>
          <a
            className="text-owhite hover:text-orange-400"
            href={story?.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            aria-label="Open story in new tab"
          >
            <LinkIcon />
          </a>
          <div className="opacity-50">|</div>
          <a
            className="text-owhite hover:text-orange-400"
            href={`https://twitter.com/share?text=${
              story?.title + "%0a%0a-"
            }&url=${story
              ?.url}%0a%0a(discovered via https://rand.hn powered by @AxiomFM)`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share this page"
          >
            <TweetIcon />
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
      <Item className="flex-0 block lg:hidden">
        <button
          className="flex items-center"
          title="Next story"
          aria-label="Next story"
          onClick={() => loadStory(kind)}
        >
          <span className="font-semibold uppercase">Next Story</span>
        </button>
        <div className="opacity-50">|</div>
        <button
          className={`flex items-center ${
            sidebarShowing ? "text-orange-500" : "text-owhite"
          }`}
          title="View sidebar"
          aria-label="View sidebar"
          onClick={() => toggleSidebar()}
        >
          <MenuIcon />
        </button>
      </Item>
    </menu>
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
