import { useQuery } from '@tanstack/react-query';
import { useStory } from './use-story';

export type User = {
  id: string;
  about: string;
  created: number;
  karma: number;
};

export const useUser = () => {
  const { data: story } = useStory();

  return useQuery({
    enabled: !!story?.by,
    queryKey: ['user', { id: story?.by }],
    queryFn: async () => {
      const response = await fetch(`/api/user/${story?.by}`, {
        method: 'GET',
        headers: {
          'Accept-Encoding': 'application/json',
        },
      });
      const json = await response.json();
      return json as User;
    },
  });
};
