import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { mount, flushPromises } from '@vue/test-utils';
import { QueryClient, dehydrate, hydrate } from '@tanstack/query-core';
import { it, expect, vi } from 'vitest';
import { resourceOptions } from '../../shared/api/client/resource';
it('renders Options API resources on SSR and reuses hydrated data without another GET', async () => {
  const load = vi.fn().mockResolvedValue({ status: 'ok' });
  const Fixture = defineComponent({
    mixins: [resourceOptions({ key: ['health'], load })],
    render() {
      return h('p', this.resource.data?.status ?? 'loading');
    },
  });
  const serverQuery = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
  const serverApp = createSSRApp(Fixture);
  serverApp.config.globalProperties.$nuxt = { $query: serverQuery } as never;
  expect(await renderToString(serverApp)).toContain('ok');
  expect(load).toHaveBeenCalledOnce();
  const clientQuery = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
  hydrate(clientQuery, dehydrate(serverQuery));
  const wrapper = mount(Fixture, { global: { mocks: { $nuxt: { $query: clientQuery } } } });
  await flushPromises();
  expect(wrapper.text()).toBe('ok');
  expect(load).toHaveBeenCalledOnce();
  await wrapper.vm.refreshResource();
  expect(load).toHaveBeenCalledTimes(2);
  await wrapper.vm.clearResource();
  expect(wrapper.vm.resource.data).toBeUndefined();
  wrapper.unmount();
  serverQuery.clear();
  clientQuery.clear();
});
