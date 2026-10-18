import type { MessageApi, DialogApi, NotificationApi } from 'naive-ui';
export type UiServices = { message: MessageApi; dialog: DialogApi; notification: NotificationApi };
export const uiServicesKey = Symbol('ui-services');
