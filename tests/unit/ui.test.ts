import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppHeading from '../../shared/ui/AppHeading.vue';
import AppGrid from '../../shared/ui/AppGrid.vue';
import AppEmptyState from '../../shared/ui/AppEmptyState.vue';
describe('UI primitives', () => {
  it('keeps heading semantics separate from visual size', () => {
    const wrapper = mount(AppHeading, {
      props: { as: 'h1', variant: 'display' },
      slots: { default: 'Hello' },
    });
    expect(wrapper.element.tagName).toBe('H1');
    expect(wrapper.classes()).toContain('display');
  });
  it('configures responsive grid columns', () => {
    expect(mount(AppGrid, { props: { columns: 3 } }).attributes('style')).toContain('--columns: 3');
  });
  it('announces empty state', () => {
    expect(
      mount(AppEmptyState, { props: { title: 'Nothing yet' }, global: { stubs: { Icon: true } } })
        .get('[role=status]')
        .text(),
    ).toContain('Nothing yet');
  });
});
