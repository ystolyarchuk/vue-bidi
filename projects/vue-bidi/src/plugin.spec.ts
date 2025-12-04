import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createApp } from 'vue';
import { defineComponent } from 'vue';
import VueBidi from './plugin';
import { getGlobalBidi, resetGlobalBidi } from './composables/useBidi';

describe('VueBidi plugin', () => {
  let app: ReturnType<typeof createApp> | null = null;
  let container: HTMLElement | null = null;

  beforeEach(() => {
    resetGlobalBidi();
    container = document.createElement('div');
    document.body.appendChild(container);
    app = createApp(
      defineComponent({
        template: '<div v-bidi></div>',
      })
    );
  });

  afterEach(() => {
    if (app && container) {
      app.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
    container = null;
    app = null;
  });

  it('should install the plugin', () => {
    expect(() => {
      app.use(VueBidi);
      app.mount(container);
    }).not.toThrow();
  });

  it('should register v-bidi directive globally', () => {
    app.use(VueBidi);
    app.mount(container);

    const element = container.querySelector('div');
    expect(element).toBeTruthy();
    expect(element?.getAttribute('dir')).toBe('ltr');
  });

  it('should work with explicit direction', () => {
    const TestComponent = defineComponent({
      template: '<div v-bidi="\'rtl\'"></div>',
    });

    const testApp = createApp(TestComponent);
    testApp.use(VueBidi);
    const testContainer = document.createElement('div');
    document.body.appendChild(testContainer);
    testApp.mount(testContainer);

    const element = testContainer.querySelector('div');
    expect(element?.getAttribute('dir')).toBe('rtl');

    testApp.unmount();
    document.body.removeChild(testContainer);
  });

  it('should update direction when service changes', async () => {
    if (!app || !container) return;
    
    app.use(VueBidi);
    app.mount(container);

    const element = container.querySelector('div');
    expect(element?.getAttribute('dir')).toBe('ltr');

    const bidi = getGlobalBidi();
    bidi.setDir('rtl');
    
    // Wait for next tick and a bit more for watchEffect
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(element?.getAttribute('dir')).toBe('rtl');
  });

  it('should have install method', () => {
    expect(VueBidi.install).toBeDefined();
    expect(typeof VueBidi.install).toBe('function');
  });

  it('should register directive with correct name', () => {
    const mockApp = {
      directive: vi.fn(),
    } as any;

    VueBidi.install(mockApp);
    expect(mockApp.directive).toHaveBeenCalledWith('bidi', expect.any(Object));
  });
});

