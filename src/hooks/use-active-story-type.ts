import { navItems } from '@/components/nav-bar';
import { useQueryState, parseAsStringEnum } from 'nuqs';

export const useActiveStoryType = () => {
  return useQueryState(
    'k',
    parseAsStringEnum(navItems.map((item) => item.id))
      .withOptions({
        clearOnDefault: true,
        history: 'replace',
      })
      .withDefault('top'),
  );
};
