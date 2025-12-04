import { beforeEach, vi } from 'vitest';

// Mock document.documentElement for tests
beforeEach(() => {
  // Reset document.documentElement dir attribute
  if (typeof document !== 'undefined') {
    document.documentElement.removeAttribute('dir');
  }
});

