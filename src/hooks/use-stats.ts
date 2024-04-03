import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useActiveStoryType } from './use-active-story-type';
import type { Stats, Story } from '@/app/api/story/route';

export const useStats = () => {
  const [activeStoryType] = useActiveStoryType();
  return useQuery({
    queryKey: [
      'stats',
      {
        type: activeStoryType,
      },
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const result = await fetch(`/api/story?type=${activeStoryType}`);
      const json = await result.json();
      return (
        json as {
          story: Story;
          stats: Stats;
        }
      ).stats;
    },
  });
};
