import { type Store as VuexStore } from 'vuex';
import App from '~/App.vue';
import { type Commit, type Dispatch } from '@node_modules/vuex';

interface Store extends VuexStore<any> {
  $app: App;
  readonly state: any;
  dispatch: Dispatch;
  commit: Commit;
}

interface User {
  id?: string;
  username?: string;
  email?: string;

  isSignedIn: boolean;
}

// declare my own store state
interface State {
  user: User;
  commit: (event: string, data?: any) => void;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: Store;
    $user: User;
  }
}
