import React from 'react';

interface FrameProps {
  url?: string;
}

export const Frame = ({ url }: FrameProps) => {
  return (
    <iframe
      style={{
        width: "100%",
        height: "calc(100vh - 32px)",
        marginTop: 32,
        border: "none",
        padding: 0,
      }}
      src={url}
      title="description"
      sandbox=""
    ></iframe>
  );
};
