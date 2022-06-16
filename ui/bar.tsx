/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Component, h } from 'https://deno.land/x/nano_jsx@v0.0.32/mod.ts';
import { tw } from 'https://esm.sh/twind@0.16.16';

interface StoryKind {
  id: string;
  label: string;
}

const storyKinds: StoryKind[] = [
  { id: "top", label: "Top" },
  { id: "best", label: "Best" },
  { id: "ask", label: "AskHN" },
  { id: "show", label: "ShowHN" },
];

export class Bar extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    const activeStoryType = "top";
    return (
      <div
        class={tw`fixed top-0 left-0 right-0 bg-gray-900 border-b-2 border-orange-500 flex flex-row items-center  font-mono text(white xs) pt-0.5 px-4`}
        style="height: 32px"
      >
        <div class={tw`flex-1 grow flex items-center justify-start space-x-2`}>
          <div class={tw`text-medium tracking-wider`}>
            RAND
            <span class={tw`text-orange-500`}>HN</span>
          </div>
          <div class={tw`text(bold gray-400)`}>/</div>
          <div>Hacker News Roulette</div>
        </div>
        <div
          class={tw`flex-1 text-center flex items-center justify-center space-x-3`}
        >
          {storyKinds.map((kind) => (
            <div
              class={tw`${
                kind.id === activeStoryType ? "text-white" : "text-gray-400"
              }`}
              key={kind.id}
            >
              {`${
                kind.id === activeStoryType
                  ? "[" + kind.label + "]"
                  : kind.label
              }`}
            </div>
          ))}
        </div>
        <div class={tw`flex-1 grow flex items-center justify-end space-x-4`}>
          <div class={tw`text-red-500`}>♥</div>
          <div class={tw`text-white uppercase font-bold`}>[Spin the wheel]</div>
        </div>
      </div>
    );
  }
}
