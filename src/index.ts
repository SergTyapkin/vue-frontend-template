import { createApp } from 'vue';

import App from '~/App.vue';
import WS from '@sergtyapkin/reconnecting-websocket';
import Store from '~/Store';
import createVueRouter from '~/Router';

import '~/styles/fontsLoader.styl';
import '~/styles/global.styl';

const Router = createVueRouter(Store);
const app = createApp(App).use(Router).use(WS).use(Store).mount('#app');
Store.$app = app;
