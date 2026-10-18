import { mount } from '@vue/test-utils';
import { renderToString } from 'vue/server-renderer';
import { createSSRApp } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AppCookieNotice from '../../app/components/AppCookieNotice.vue';

const key = 'cookie-notice:acknowledged:v1';
const mountNotice = () =>
  mount(AppCookieNotice, {
    global: {
      mocks: { $t: (value: string) => value },
      stubs: { AppIcon: true, AppButton: { template: '<button><slot /></button>' } },
    },
  });

describe('cookie notice', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('shows on first visit and remembers acknowledgement across mounts', async () => {
    const wrapper = mountNotice();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('aside').exists()).toBe(true);
    await wrapper.get('button').trigger('click');
    expect(window.localStorage.getItem(key)).toBe('true');
    expect(wrapper.find('aside').exists()).toBe(false);
    wrapper.unmount();
    const returningVisit = mountNotice();
    await returningVisit.vm.$nextTick();
    expect(returningVisit.find('aside').exists()).toBe(false);
    returningVisit.unmount();
  });

  it('still displays and dismisses when storage is blocked', async () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    const wrapper = mountNotice();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('aside').exists()).toBe(true);
    await wrapper.get('button').trigger('click');
    expect(wrapper.find('aside').exists()).toBe(false);
    wrapper.unmount();
  });

  it('does not read browser storage or render a notice during SSR', async () => {
    const read = vi.spyOn(window.localStorage, 'getItem');
    const html = await renderToString(createSSRApp(AppCookieNotice));
    expect(html).not.toContain('data-testid="cookie-notice"');
    expect(read).not.toHaveBeenCalled();
  });
});
