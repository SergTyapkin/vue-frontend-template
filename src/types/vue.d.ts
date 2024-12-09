import App from "~/App.vue";
import API from "~/Api";
import { Modals, Popups } from '@sergtyapkin/modals-popups';
import { WS } from '@sergtyapkin/reconnecting-websocket';

declare module 'vue' {
  interface ComponentCustomProperties {
    $app: App,
    $api: API,
    $ws: WS,
    $modals: typeof Modals,
    $popups: typeof Popups,
  }
}
