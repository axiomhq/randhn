import React from 'react';

interface FrameProps {
  url?: string;
  className?: string;
}

export const Frame = ({ className, url }: FrameProps) => {
  return (
    <article
      className="flex-1 border-r-2 border-orange-800 border-opacity-20"
      style={{
        height: "calc(100vh - 32px)",
        marginTop: 32,
      }}
    >
      <iframe
        className={`${className} w-full h-full border-none p-0 m-0 `}
        src={url}
        title="description"
      ></iframe>
    </article>
  );
};
