/**
 * Test setup for Studio
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    to: vi.fn((_target, vars) => {
      // Immediately call onComplete if provided
      if (vars.onComplete) {
        vars.onComplete();
      }
      return { kill: vi.fn() };
    }),
    fromTo: vi.fn((_target, _fromVars, toVars) => {
      if (toVars.onComplete) {
        toVars.onComplete();
      }
      return { kill: vi.fn() };
    }),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
    },
  },
  gsap: {
    to: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
    },
  },
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock getComputedStyle for canvas token reading
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = vi.fn((element) => {
  const result = originalGetComputedStyle(element);
  return {
    ...result,
    getPropertyValue: vi.fn((prop: string) => {
      if (prop === '--color-background') return 'oklch(1 0 0)';
      if (prop === '--color-muted') return 'oklch(0.9 0 0)';
      return '';
    }),
  };
});

// Mock canvas context
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillStyle: '',
  globalAlpha: 1,
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
}));

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
  x: 0,
  y: 0,
  toJSON: vi.fn(),
}));
