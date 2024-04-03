import { Store } from '@tanstack/store';

type State = {
  sidebarOpen: boolean;
};

export const globalStore = new Store<State>({
  sidebarOpen: false,
});
