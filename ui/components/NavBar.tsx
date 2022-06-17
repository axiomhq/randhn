import React, { useState } from 'react';

import { LoadStoryFunc, StoryKind } from '../store/types';

interface NavItem {
  id: StoryKind;
  label: string;
}

const navItems: NavItem[] = [
  { id: "random", label: "Random" },
  { id: "top", label: "Top" },
  { id: "new", label: "New" },
  { id: "best", label: "Best" },
  { id: "show", label: "ShowHN" },
];

interface NavBarProps {
  loadStory: LoadStoryFunc;
  loading: boolean;
}

export const NavBar = ({ loading, loadStory }: NavBarProps) => {
  const [activeStoryType, setActiveStoryType] = useState<StoryKind>("top");

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-gray-800 border-b-2 border-orange-500 flex flex-row items-center font-mono text-white text-xs pt-0.5 px-4 z-50"
      style={{ height: 32 }}
    >
      <div className="grow flex items-center justify-start space-x-2">
        <div className="font-medium tracking-wider">
          RAND
          <span className="text-orange-500">HN</span>
        </div>
        <div className="text-gray-400 font-bold">/</div>
        <div>Hacker News Roulette</div>
      </div>
      <div className="grow flex items-center space-x-2">
        <div className="flex items-center space-x-0">
          {navItems.map((item) => {
            const active = item.id === activeStoryType;

            return (
              <button
                key={item.id}
                className={`transition-colors ${
                  active ? "text-orange-400" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveStoryType(item.id)}
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
        <div className="text-gray-400">/</div>
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
        <div className="flex-1 flex items-center justify-end space-x-2">
          <div className="text-red-500 text-lg">♥</div>
        </div>
      </div>
    </nav>
  );
};
