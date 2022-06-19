import { useRouter } from "next/router";
import React, { useState } from "react";

import { LoadStoryFunc, NavItems, StoryKind } from "../store/types";

interface NavBarProps {
  loadStory: LoadStoryFunc;
  loading: boolean;
}

export const NavBar = ({ loading, loadStory }: NavBarProps) => {
  const router = useRouter();
  const activeStoryType =
    [...NavItems.map((i) => i.id)].find((i) => i === router.query.k) || "top";

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-gray-800 border-b-2 border-orange-800 border-opacity-20 flex flex-row items-center font-mono text-owhite text-xs pt-0.5 px-4 z-50"
      style={{ height: 32 }}
    >
      <div className="grow flex items-center justify-start">
        <div className="font-medium tracking-wider">
          rand<span className="text-gray-300">(</span>
          <span className="text-orange-500">HN</span>
          <span className="text-gray-300">)</span>
        </div>
        <div className="text-gray-500 font-bold">&nbsp;&nbsp;/&nbsp;</div>
        <div className="flex items-center space-x-0">
          {NavItems.map((item) => {
            const active = item.id === activeStoryType;

            return (
              <button
                key={item.id}
                className={`transition-colors ${
                  active ? "text-orange-400" : "text-gray-400 hover:text-white"
                }`}
                onClick={() =>
                  router.push(`/?k=${item.id}`, undefined, { shallow: true })}
              >
                <span className={`${active ? "" : "opacity-0 select-none"}`}>
                  [
                </span>
                <span>{item.label}</span>
                <span className={`${active ? "" : "opacity-0 select-none"}`}>
                  ]
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grow hidden lg:flex items-center space-x-2">
        <button
          className={`uppercase ${
            loading
              ? "pointer-events-none animate-pulse"
              : "pointer-events-auto"
          }`}
          onClick={() => loadStory(activeStoryType)}
        >
          <span className={`text-orange-600`}>&lt;</span>
          <span className={`text-orange-400`}>&lt;</span>
          <span className="transition-[padding] text-gray-100 hover:px-1 hover:text-bwhite active:px-0 active:text-gray-200">
            {" "}
            Spin the Wheel{" "}
          </span>
          <span className={`text-orange-400`}>&gt;</span>
          <span className={`text-orange-600`}>&gt;</span>
        </button>
      </div>
      <div className="grow text-center flex items-center justify-center space-x-2">
        <div className="flex-1 flex items-center justify-end space-x-4">
          <div>
            <a
              className="flex items-center text-gray-200 hover:underline opacity-80 hover:opacity-100"
              href="https://twitter.com/share?text=Check out RandHN to browse HackerNews stories!&url=https://rand.hn%0a%0a - powered by @AxiomFM"
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Twitter"
              aria-label="Share on Twitter"
            >
              <span className="text-red-500 mr-2 text-lg">♥</span>
              <span className="hidden lg:inline-block">Share RandHN</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
