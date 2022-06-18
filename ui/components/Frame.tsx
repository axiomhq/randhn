import React from 'react';

import { Story } from '../store/types';
import { CopyIcon, GlobeIcon, LinkIcon, TweetIcon } from './Icons';
import { Toolbar } from './Toolbar';

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
      <Toolbar story={story} />
      <iframe
        className={`${className} w-full h-full border-none p-0 m-0 `}
        src={url}
        title={story?.title}
      ></iframe>
    </article>
  );
};
