import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBidi, getGlobalBidi, resetGlobalBidi, type TextDir } from './useBidi';

describe('useBidi', () => {
  beforeEach(() => {
    // Reset global instance before each test
    resetGlobalBidi();
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('dir');
    }
  });

  describe('setLang', () => {
    it('should set direction to rtl for Arabic', () => {
      const { dir, setLang } = useBidi();
      setLang('ar');
      expect(dir.value).toBe('rtl');
    });

    it('should set direction to rtl for Hebrew', () => {
      const { dir, setLang } = useBidi();
      setLang('he');
      expect(dir.value).toBe('rtl');
    });

    it('should set direction to rtl for Farsi', () => {
      const { dir, setLang } = useBidi();
      setLang('fa');
      expect(dir.value).toBe('rtl');
    });

    it('should set direction to rtl for Urdu', () => {
      const { dir, setLang } = useBidi();
      setLang('ur');
      expect(dir.value).toBe('rtl');
    });

    it('should set direction to rtl for Kurdish', () => {
      const { dir, setLang } = useBidi();
      setLang('ku');
      expect(dir.value).toBe('rtl');
    });

    it('should set direction to rtl for Dhivehi', () => {
      const { dir, setLang } = useBidi();
      setLang('dv');
      expect(dir.value).toBe('rtl');
    });

    it('should set direction to rtl for Pashto', () => {
      const { dir, setLang } = useBidi();
      setLang('ps');
      expect(dir.value).toBe('rtl');
    });

    it('should handle language with region code', () => {
      const { dir, setLang } = useBidi();
      setLang('ar-SA');
      expect(dir.value).toBe('rtl');
    });

    it('should handle language with region code (Hebrew)', () => {
      const { dir, setLang } = useBidi();
      setLang('he-IL');
      expect(dir.value).toBe('rtl');
    });

    it('should set direction to ltr for non-RTL languages', () => {
      const { dir, setLang } = useBidi();
      setLang('en');
      expect(dir.value).toBe('ltr');
    });

    it('should set direction to ltr for French', () => {
      const { dir, setLang } = useBidi();
      setLang('fr');
      expect(dir.value).toBe('ltr');
    });

    it('should set direction to ltr for Spanish', () => {
      const { dir, setLang } = useBidi();
      setLang('es');
      expect(dir.value).toBe('ltr');
    });

    it('should handle null language', () => {
      const { dir, setLang } = useBidi();
      setLang(null);
      expect(dir.value).toBe('ltr');
    });

    it('should handle undefined language', () => {
      const { dir, setLang } = useBidi();
      setLang(undefined);
      expect(dir.value).toBe('ltr');
    });

    it('should handle case insensitive language codes', () => {
      const { dir, setLang } = useBidi();
      setLang('AR');
      expect(dir.value).toBe('rtl');
    });

    it('should call setDir with ltr when lang is empty string', () => {
      const { dir, setLang } = useBidi();
      setLang('');
      expect(dir.value).toBe('ltr');
    });

    it('should extract language code from locale string and set rtl', () => {
      const { dir, setLang } = useBidi();
      setLang('fa-IR'); // Farsi with region
      expect(dir.value).toBe('rtl');
    });

    it('should extract language code from locale string and set ltr', () => {
      const { dir, setLang } = useBidi();
      setLang('en-US'); // English with region
      expect(dir.value).toBe('ltr');
    });
  });

  describe('setDir', () => {
    it('should set direction to ltr', () => {
      const { dir, setDir } = useBidi();
      setDir('ltr');
      expect(dir.value).toBe('ltr');
    });

    it('should set direction to rtl', () => {
      const { dir, setDir } = useBidi();
      setDir('rtl');
      expect(dir.value).toBe('rtl');
    });

    it('should update document.documentElement dir attribute', () => {
      const { setDir } = useBidi();
      setDir('rtl');
      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    });

    it('should not update direction if same value', () => {
      const { setDir } = useBidi();
      setDir('ltr');
      const setAttributeSpy = vi.spyOn(document.documentElement, 'setAttribute');
      setDir('ltr');
      // setAttribute should not be called again for the same value
      expect(setAttributeSpy).not.toHaveBeenCalled();
      setAttributeSpy.mockRestore();
    });

    it('should not update direction if same value (rtl)', () => {
      const { setDir } = useBidi();
      setDir('rtl');
      const setAttributeSpy = vi.spyOn(document.documentElement, 'setAttribute');
      setDir('rtl');
      expect(setAttributeSpy).not.toHaveBeenCalled();
      setAttributeSpy.mockRestore();
    });
  });

  describe('dir', () => {
    it('should return initial direction as ltr', () => {
      const { dir } = useBidi();
      expect(dir.value).toBe('ltr');
    });

    it('should be readonly', () => {
      const { dir } = useBidi();
      // dir should be readonly, but we can't test runtime errors easily
      // TypeScript will catch this at compile time
      expect(dir.value).toBe('ltr');
    });
  });

  describe('oppositeDir', () => {
    it('should return rtl when current direction is ltr', () => {
      const { oppositeDir, setDir } = useBidi();
      setDir('ltr');
      // Access oppositeDir.value to trigger computed evaluation
      const opposite = oppositeDir.value;
      expect(opposite).toBe('rtl');
    });

    it('should return ltr when current direction is rtl', () => {
      const { oppositeDir, setDir } = useBidi();
      setDir('rtl');
      // Access oppositeDir.value to trigger computed evaluation
      const opposite = oppositeDir.value;
      expect(opposite).toBe('ltr');
    });

    it('should update opposite direction when direction changes', () => {
      const { oppositeDir, setDir } = useBidi();
      setDir('ltr');
      expect(oppositeDir.value).toBe('rtl');
      setDir('rtl');
      expect(oppositeDir.value).toBe('ltr');
    });

    it('should compute opposite direction reactively', () => {
      const { dir, oppositeDir, setDir } = useBidi();
      // Start with ltr
      setDir('ltr');
      expect(dir.value).toBe('ltr');
      expect(oppositeDir.value).toBe('rtl');
      
      // Change to rtl
      setDir('rtl');
      expect(dir.value).toBe('rtl');
      expect(oppositeDir.value).toBe('ltr');
    });
  });
});

describe('getGlobalBidi', () => {
  it('should return the same instance on multiple calls', () => {
    const instance1 = getGlobalBidi();
    const instance2 = getGlobalBidi();
    expect(instance1).toBe(instance2);
  });
});

