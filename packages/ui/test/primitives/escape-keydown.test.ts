import { describe, expect, it } from 'vitest';
import { onEscapeKeyDown } from '../../src/primitives/escape-keydown';

describe('onEscapeKeyDown', () => {
  it('calls handler on Escape and cleanup prevents further calls', () => {
    let called = 0;
    const cleanup = onEscapeKeyDown(() => {
      called += 1;
    });

    const ev = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(ev);
    expect(called).toBe(1);

    cleanup();
    const ev2 = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(ev2);
    expect(called).toBe(1);
  });
});
