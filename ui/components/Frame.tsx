import React from 'react';

interface FrameProps {
  url?: string;
  className?: string;
}

export const Frame = ({ className, url }: FrameProps) => {
  return (
    <iframe
      className={className}
      style={{
        width: "100%",
        height: "calc(100vh - 32px)",
        marginTop: 32,
        border: "none",
        padding: 0,
      }}
      src={url}
      title="description"
    ></iframe>
  );
};
