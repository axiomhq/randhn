import classNames from "classnames";
import React from "react";

import { Story } from "../store/types";
import styles from "./Frame.module.css";
import { Toolbar } from "./Toolbar";

interface FrameProps {
  story?: Story;
  url?: string;
  className?: string;
  onLoad: (state: boolean) => void;
}

export const Frame = ({ className, url, story, onLoad }: FrameProps) => {
  return (
    <article
      className={classNames(
        className,
        styles.root,
        `flex-1 border-0 lg:border-r-2 border-orange-800 border-opacity-20 lg:mr-72`
      )}
    >
      <iframe
        className="w-full h-full border-none p-0 m-0"
        src={url}
        title={story?.title}
        onLoad={() => onLoad(false)}
      ></iframe>
    </article>
  );
};
