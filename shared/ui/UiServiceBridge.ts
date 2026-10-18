// Infrastructure only: providers must be accessed inside their descendant's setup.
import { defineComponent, inject } from 'vue';
import { useMessage, useDialog, useNotification } from 'naive-ui';
import { uiServicesKey, type UiServices } from './services';
export default defineComponent({
  name: 'UiServiceBridge',
  setup() {
    const target = inject<Partial<UiServices>>(uiServicesKey)!;
    Object.assign(target, {
      message: useMessage(),
      dialog: useDialog(),
      notification: useNotification(),
    });
    return () => null;
  },
});
