import { describe, it, expect } from 'vitest';
import { useBidi, getGlobalBidi, resetGlobalBidi, type TextDir, VueBidi } from './index';
import { vBidi } from './index';

describe('index.ts exports', () => {
  it('should export useBidi', () => {
    expect(typeof useBidi).toBe('function');
    const { dir, setDir } = useBidi();
    expect(dir.value).toBe('ltr');
    setDir('rtl');
    expect(dir.value).toBe('rtl');
  });

  it('should export getGlobalBidi', () => {
    expect(typeof getGlobalBidi).toBe('function');
    const bidi = getGlobalBidi();
    expect(bidi).toBeDefined();
    expect(bidi.dir).toBeDefined();
  });

  it('should export resetGlobalBidi', () => {
    expect(typeof resetGlobalBidi).toBe('function');
    expect(() => resetGlobalBidi()).not.toThrow();
  });

  it('should export TextDir type', () => {
    const dir: TextDir = 'ltr';
    expect(dir).toBe('ltr');
    const dir2: TextDir = 'rtl';
    expect(dir2).toBe('rtl');
  });

  it('should export vBidi directive', () => {
    expect(vBidi).toBeDefined();
    expect(vBidi.mounted).toBeDefined();
    expect(vBidi.updated).toBeDefined();
    expect(vBidi.unmounted).toBeDefined();
  });

  it('should export VueBidi plugin', () => {
    expect(VueBidi).toBeDefined();
    expect(VueBidi.install).toBeDefined();
    expect(typeof VueBidi.install).toBe('function');
  });
});

