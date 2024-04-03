'use client';
import React from 'react';
import { cn } from '@/cn';
import { useStory } from '@/hooks/use-story';

type FrameProps = {
  className?: string;
};

export const Frame = ({ className }: FrameProps) => {
  const { data: story } = useStory();

  if (!story) return null;

  return (
    <article
      className={cn(
        'flex-1 border-0 lg:border-r-2 border-orange-800 border-opacity-20 lg:mr-72 w-full max-w-full h-[calc(100dvh-32px)] mt-[32px]',
        className,
      )}
    >
      <iframe className="w-full h-full border-none p-0 m-0" src={story.url} title={story.title}></iframe>
    </article>
  );
};
