import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { vBidi } from './vBidi';
import { getGlobalBidi, resetGlobalBidi } from '../composables/useBidi';

describe('vBidi directive', () => {
  beforeEach(() => {
    // Reset global bidi instance
    resetGlobalBidi();
    const bidi = getGlobalBidi();
    bidi.setDir('ltr');
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('dir');
    }
  });

  it('should apply directive to element without explicit direction', () => {
    const Component = defineComponent({
      template: '<div v-bidi></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('ltr');
  });

  it('should set dir to rtl when v-bidi="rtl"', () => {
    const Component = defineComponent({
      template: '<div v-bidi="\'rtl\'"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('rtl');
  });

  it('should set dir to ltr when v-bidi="ltr"', () => {
    const Component = defineComponent({
      template: '<div v-bidi="\'ltr\'"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('ltr');
  });

  it('should update dir based on dynamic value', () => {
    const Component = defineComponent({
      setup() {
        const dynamicDir = ref<string>('rtl');
        return { dynamicDir };
      },
      template: '<div v-bidi="dynamicDir"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('rtl');

    wrapper.vm.dynamicDir = 'ltr';
    wrapper.vm.$nextTick(() => {
      expect(element.getAttribute('dir')).toBe('ltr');
    });
  });

  it('should not change when service direction changes if explicit direction is set', async () => {
    const Component = defineComponent({
      template: '<div v-bidi="\'rtl\'"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('rtl');

    const bidi = getGlobalBidi();
    bidi.setDir('ltr');
    await wrapper.vm.$nextTick();
    expect(element.getAttribute('dir')).toBe('rtl');
  });

  it('should update when service direction changes if no explicit direction', async () => {
    const Component = defineComponent({
      template: '<div v-bidi></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('ltr');

    const bidi = getGlobalBidi();
    bidi.setDir('rtl');
    await wrapper.vm.$nextTick();
    expect(element.getAttribute('dir')).toBe('rtl');
  });

  it('should normalize dirAuto with quotes', () => {
    const Component = defineComponent({
      template: '<div v-bidi="\'\\\'rtl\\\'\'"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('rtl');
  });

  it('should normalize dirAuto with double quotes', () => {
    const Component = defineComponent({
      setup() {
        const dir = ref('"rtl"');
        return { dir };
      },
      template: '<div v-bidi="dir"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('rtl');
  });

  it('should normalize dirAuto with whitespace', () => {
    const Component = defineComponent({
      setup() {
        const dir = ref('  LTR  ');
        return { dir };
      },
      template: '<div v-bidi="dir"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('ltr');
  });

  it('should handle invalid direction and subscribe to service', () => {
    const Component = defineComponent({
      setup() {
        const dir = ref('invalid');
        return { dir };
      },
      template: '<div v-bidi="dir"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    // Invalid direction should fall back to service
    expect(element.getAttribute('dir')).toBe('ltr');
  });

  it('should handle case insensitive direction', () => {
    const Component = defineComponent({
      setup() {
        const dir = ref('RTL');
        return { dir };
      },
      template: '<div v-bidi="dir"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('rtl');
  });

  it('should clean up watcher on unmount', () => {
    const Component = defineComponent({
      template: '<div v-bidi></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('ltr');

    // Unmount should not throw
    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  it('should resubscribe when switching from explicit direction back to service', async () => {
    const Component = defineComponent({
      setup() {
        const dynamicDir = ref<string | undefined>('rtl');
        return { dynamicDir };
      },
      template: '<div v-bidi="dynamicDir"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('rtl');

    const bidi = getGlobalBidi();
    bidi.setDir('ltr');
    await wrapper.vm.$nextTick();
    // Should still be rtl because explicit direction takes precedence
    expect(element.getAttribute('dir')).toBe('rtl');

    // Clear explicit direction - should resubscribe to service
    wrapper.vm.dynamicDir = undefined;
    await wrapper.vm.$nextTick();
    // Should now use service value (ltr)
    expect(element.getAttribute('dir')).toBe('ltr');

    // Should update when service changes
    bidi.setDir('rtl');
    await wrapper.vm.$nextTick();
    expect(element.getAttribute('dir')).toBe('rtl');
  });

  it('should clean up watcher when switching from one explicit direction to another', async () => {
    const Component = defineComponent({
      setup() {
        const dynamicDir = ref<string>('rtl');
        return { dynamicDir };
      },
      template: '<div v-bidi="dynamicDir"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    expect(element.getAttribute('dir')).toBe('rtl');

    // Change to another explicit direction - should clean up previous watcher
    wrapper.vm.dynamicDir = 'ltr';
    await wrapper.vm.$nextTick();
    expect(element.getAttribute('dir')).toBe('ltr');

    // Change again - should handle cleanup properly
    wrapper.vm.dynamicDir = 'rtl';
    await wrapper.vm.$nextTick();
    expect(element.getAttribute('dir')).toBe('rtl');

    // Verify that service changes don't affect explicit direction
    const bidi = getGlobalBidi();
    bidi.setDir('ltr');
    await wrapper.vm.$nextTick();
    // Should still be rtl because explicit direction takes precedence
    expect(element.getAttribute('dir')).toBe('rtl');
  });

  it('should clean up watcher when switching from service subscription to explicit direction', async () => {
    // Start without explicit direction (subscribed to service)
    const Component = defineComponent({
      setup() {
        const dynamicDir = ref<string | undefined>(undefined);
        return { dynamicDir };
      },
      template: '<div v-bidi="dynamicDir"></div>',
      directives: {
        bidi: vBidi,
      },
    });

    const wrapper = mount(Component);
    const element = wrapper.element as HTMLElement;
    const bidi = getGlobalBidi();
    
    // Initially subscribed to service
    expect(element.getAttribute('dir')).toBe('ltr');
    
    // Change service direction - should update
    bidi.setDir('rtl');
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(element.getAttribute('dir')).toBe('rtl');
    
    // Now set explicit direction - this should trigger cleanup of watcher (lines 61-63)
    wrapper.vm.dynamicDir = 'ltr';
    await wrapper.vm.$nextTick();
    expect(element.getAttribute('dir')).toBe('ltr');
    
    // Verify watcher was cleaned up - service changes should not affect element
    bidi.setDir('rtl');
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    // Should still be ltr because explicit direction takes precedence
    expect(element.getAttribute('dir')).toBe('ltr');
  });
});

