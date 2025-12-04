import { type Directive, type DirectiveBinding, watchEffect } from 'vue';
import { getGlobalBidi, type TextDir } from '../composables/useBidi';

/**
 * Normalizes direction value from string to TextDir
 */
function normalizeDir(value: string | TextDir | undefined): TextDir | null {
  if (!value) return null;
  
  // Remove quotes from start and end, then trim and lowercase
  let normalized = String(value).trim();
  // Remove surrounding quotes (single or double)
  normalized = normalized.replace(/^['"]|['"]$/g, '').trim();
  normalized = normalized.toLowerCase();
  
  if (normalized === 'rtl' || normalized === 'ltr') {
    return normalized as TextDir;
  }
  
  return null;
}

/**
 * Vue directive that applies `dir` attribute to the element.
 * 
 * Usage:
 * ```vue
 * <div v-bidi></div>
 * <div v-bidi="'rtl'"></div>
 * <div v-bidi="dir"></div>
 * ```
 */
export const vBidi: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | TextDir | undefined>) {
    const normalizedDir = normalizeDir(binding.value);
    const bidi = getGlobalBidi();
    
    // If explicit direction is provided, use it
    if (normalizedDir) {
      el.setAttribute('dir', normalizedDir);
      return;
    }

    // Otherwise, subscribe to service direction changes
    const stopWatcher = watchEffect(() => {
      el.setAttribute('dir', bidi.dir.value);
    });

    // Store stop function on element for cleanup
    (el as any).__vueBidiStop = stopWatcher;
  },

  updated(el: HTMLElement, binding: DirectiveBinding<string | TextDir | undefined>) {
    const normalizedDir = normalizeDir(binding.value);
    const bidi = getGlobalBidi();
    
    // If explicit direction is provided, use it and stop watching
    if (normalizedDir) {
      // Stop previous watcher if exists
      if ((el as any).__vueBidiStop) {
        (el as any).__vueBidiStop();
        (el as any).__vueBidiStop = undefined;
      }
      el.setAttribute('dir', normalizedDir);
      return;
    }

    // If no explicit direction, ensure we have a watcher
    if (!(el as any).__vueBidiStop) {
      // Create watcher if it doesn't exist
      const stopWatcher = watchEffect(() => {
        el.setAttribute('dir', bidi.dir.value);
      });
      (el as any).__vueBidiStop = stopWatcher;
    }
    // If watcher already exists, it will automatically update via watchEffect
  },

  unmounted(el: HTMLElement) {
    // Clean up watcher on unmount
    if ((el as any).__vueBidiStop) {
      (el as any).__vueBidiStop();
      (el as any).__vueBidiStop = undefined;
    }
  },
};

