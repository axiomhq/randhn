'use client';
import { cn } from '@/cn';
import { Icon } from './icons';
import { useStory } from '@/hooks/use-story';

export const LoadingSpinner = () => {
  const { isLoading, isPlaceholderData, isFetching } = useStory();
  const pending = isLoading || isPlaceholderData || isFetching;
  return (
    <div
      className={cn(
        'fixed w-full h-full z-40 flex items-center justify-around pointer-events-none transition-all ease-out duration-500 bg-white bg-opacity-50',
        pending ? 'opacity-75' : 'opacity-0',
        'lg:w-[calc(100dvw-288px)] lg:max-w-[calc(100dvw-288px)]',
      )}
    >
      <Icon name="spinner" className="text-orange-800" />
    </div>
  );
};
