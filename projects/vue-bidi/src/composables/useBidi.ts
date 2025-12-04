import { ref, computed, readonly } from 'vue';

export type TextDir = 'ltr' | 'rtl';

/**
 * Composable for managing text direction (LTR/RTL)
 * 
 * @example
 * ```ts
 * const { dir, setLang, setDir, oppositeDir } = useBidi();
 * 
 * setLang('ar'); // Sets to rtl
 * setDir('ltr'); // Override to ltr
 * ```
 */
export function useBidi() {
  // Default list of RTL languages
  const rtlLangs: readonly string[] = ['ar', 'he', 'fa', 'dv', 'ku', 'ur', 'ps'];

  // Internal direction state
  const dir = ref<TextDir>('ltr');

  /**
   * Sets language and automatically detects text direction.
   * Example: 'he-IL' -> 'he' -> rtl
   */
  const setLang = (lang: string | null | undefined): void => {
    if (!lang) {
      setDir('ltr');
      return;
    }

    const code = lang.toLowerCase().split('-')[0];
    const isRtl = rtlLangs.includes(code);

    setDir(isRtl ? 'rtl' : 'ltr');
  };

  /**
   * Forces direction explicitly.
   */
  const setDir = (newDir: TextDir): void => {
    if (dir.value !== newDir) {
      dir.value = newDir;

      // Update the root HTML attribute
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('dir', newDir);
      }
    }
  };

  /**
   * Returns opposite direction as computed ref.
   */
  const oppositeDir = computed<TextDir>(() => {
    return dir.value === 'ltr' ? 'rtl' : 'ltr';
  });

  return {
    dir: readonly(dir),
    setLang,
    setDir,
    oppositeDir,
  };
}

// Global singleton instance for directive usage
let globalBidiInstance: ReturnType<typeof useBidi> | null = null;

/**
 * Get or create global bidi instance
 * Used internally by the directive
 */
export function getGlobalBidi(): ReturnType<typeof useBidi> {
  if (!globalBidiInstance) {
    globalBidiInstance = useBidi();
  }
  return globalBidiInstance;
}

/**
 * Reset global bidi instance (for testing)
 */
export function resetGlobalBidi(): void {
  globalBidiInstance = null;
}

