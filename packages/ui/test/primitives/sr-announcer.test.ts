import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  announceToScreenReader,
  clearAllAnnouncers,
  createAnnouncer,
  createAssertiveAnnouncer,
  createPoliteAnnouncer,
  createQueuedAnnouncer,
  getAnnouncerCount,
} from '../../src/primitives/sr-announcer';

describe('createAnnouncer', () => {
  beforeEach(() => {
    clearAllAnnouncers();
  });

  afterEach(() => {
    clearAllAnnouncers();
  });

  it('creates a live region element', () => {
    const announcer = createAnnouncer();
    const element = announcer.getElement();

    expect(element).not.toBeNull();
    expect(element?.getAttribute('aria-live')).toBe('polite');
    expect(element?.getAttribute('aria-atomic')).toBe('true');
    expect(element?.getAttribute('role')).toBe('status');

    announcer.destroy();
  });

  it('uses polite by default', () => {
    const announcer = createAnnouncer();
    const element = announcer.getElement();

    expect(element?.getAttribute('aria-live')).toBe('polite');

    announcer.destroy();
  });

  it('uses assertive when specified', () => {
    const announcer = createAnnouncer({ politeness: 'assertive' });
    const element = announcer.getElement();

    expect(element?.getAttribute('aria-live')).toBe('assertive');

    announcer.destroy();
  });

  it('sets role based on politeness', () => {
    const politeAnnouncer = createAnnouncer({ politeness: 'polite' });
    expect(politeAnnouncer.getElement()?.getAttribute('role')).toBe('status');
    politeAnnouncer.destroy();

    clearAllAnnouncers();

    const assertiveAnnouncer = createAnnouncer({ politeness: 'assertive' });
    expect(assertiveAnnouncer.getElement()?.getAttribute('role')).toBe('alert');
    assertiveAnnouncer.destroy();
  });

  it('allows custom role', () => {
    const announcer = createAnnouncer({ role: 'log' });
    const element = announcer.getElement();

    expect(element?.getAttribute('role')).toBe('log');

    announcer.destroy();
  });

  it('announces messages', async () => {
    const announcer = createAnnouncer({ clearAfterAnnounce: false });
    const element = announcer.getElement();

    announcer.announce('Test message');

    // Wait for requestAnimationFrame
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(element?.textContent).toBe('Test message');

    announcer.destroy();
  });

  it('clears messages after timeout', async () => {
    vi.useFakeTimers();

    const announcer = createAnnouncer({
      clearAfterAnnounce: true,
      clearTimeout: 100,
    });
    const element = announcer.getElement();

    announcer.announce('Test message');

    // Wait for requestAnimationFrame
    await vi.runOnlyPendingTimersAsync();

    expect(element?.textContent).toBe('Test message');

    // Wait for clear timeout
    vi.advanceTimersByTime(100);

    expect(element?.textContent).toBe('');

    announcer.destroy();
    vi.useRealTimers();
  });

  it('clears current message', async () => {
    const announcer = createAnnouncer({ clearAfterAnnounce: false });
    const element = announcer.getElement();

    announcer.announce('Test message');
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(element?.textContent).toBe('Test message');

    announcer.clear();

    expect(element?.textContent).toBe('');

    announcer.destroy();
  });

  it('removes live region on destroy', () => {
    const announcer = createAnnouncer();
    const element = announcer.getElement();

    expect(document.body.contains(element)).toBe(true);

    announcer.destroy();

    expect(document.body.contains(element)).toBe(false);
  });

  it('reuses existing announcer with same settings', () => {
    const announcer1 = createAnnouncer({ politeness: 'polite' });
    const announcer2 = createAnnouncer({ politeness: 'polite' });

    expect(announcer1).toBe(announcer2);
    expect(getAnnouncerCount()).toBe(1);

    announcer1.destroy();
  });

  it('creates separate announcers for different settings', () => {
    const polite = createAnnouncer({ politeness: 'polite' });
    const assertive = createAnnouncer({ politeness: 'assertive' });

    expect(polite).not.toBe(assertive);
    expect(getAnnouncerCount()).toBe(2);

    polite.destroy();
    assertive.destroy();
  });

  it('visually hides the live region', () => {
    const announcer = createAnnouncer();
    const element = announcer.getElement();

    expect(element?.style.position).toBe('absolute');
    expect(element?.style.width).toBe('1px');
    expect(element?.style.height).toBe('1px');
    expect(element?.style.overflow).toBe('hidden');

    announcer.destroy();
  });

  it('appends to custom container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const announcer = createAnnouncer({ container });
    const element = announcer.getElement();

    expect(container.contains(element)).toBe(true);

    announcer.destroy();
    container.remove();
  });

  it('returns no-op in SSR environment', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error Testing SSR
    delete globalThis.window;

    const announcer = createAnnouncer();

    expect(announcer.announce).toBeInstanceOf(Function);
    expect(announcer.clear).toBeInstanceOf(Function);
    expect(announcer.destroy).toBeInstanceOf(Function);
    expect(announcer.getElement()).toBeNull();

    globalThis.window = originalWindow;
  });
});

describe('announceToScreenReader', () => {
  beforeEach(() => {
    clearAllAnnouncers();
  });

  afterEach(() => {
    clearAllAnnouncers();
  });

  it('announces with polite by default', async () => {
    announceToScreenReader('Test message');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const liveRegion = document.querySelector('[data-sr-announcer="polite"]');
    expect(liveRegion?.textContent).toBe('Test message');
  });

  it('announces with assertive when specified', async () => {
    announceToScreenReader('Urgent message', 'assertive');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const liveRegion = document.querySelector('[data-sr-announcer="assertive"]');
    expect(liveRegion?.textContent).toBe('Urgent message');
  });
});

describe('createPoliteAnnouncer', () => {
  beforeEach(() => {
    clearAllAnnouncers();
  });

  afterEach(() => {
    clearAllAnnouncers();
  });

  it('creates announcer with polite politeness', () => {
    const announcer = createPoliteAnnouncer();
    const element = announcer.getElement();

    expect(element?.getAttribute('aria-live')).toBe('polite');

    announcer.destroy();
  });
});

describe('createAssertiveAnnouncer', () => {
  beforeEach(() => {
    clearAllAnnouncers();
  });

  afterEach(() => {
    clearAllAnnouncers();
  });

  it('creates announcer with assertive politeness', () => {
    const announcer = createAssertiveAnnouncer();
    const element = announcer.getElement();

    expect(element?.getAttribute('aria-live')).toBe('assertive');
    expect(element?.getAttribute('role')).toBe('alert');

    announcer.destroy();
  });
});

describe('createQueuedAnnouncer', () => {
  beforeEach(() => {
    clearAllAnnouncers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearAllAnnouncers();
    vi.useRealTimers();
  });

  it('queues multiple messages', async () => {
    const announcer = createQueuedAnnouncer({ delay: 100 });

    announcer.announce('Message 1');
    announcer.announce('Message 2');
    announcer.announce('Message 3');

    expect(announcer.queue).toHaveLength(2); // First is being processed

    await vi.advanceTimersByTimeAsync(100);
    expect(announcer.queue).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(100);
    expect(announcer.queue).toHaveLength(0);

    announcer.destroy();
  });

  it('clears queue on clear()', () => {
    const announcer = createQueuedAnnouncer({ delay: 100 });

    announcer.announce('Message 1');
    announcer.announce('Message 2');

    announcer.clear();

    expect(announcer.queue).toHaveLength(0);

    announcer.destroy();
  });
});

describe('clearAllAnnouncers', () => {
  it('removes all announcers', () => {
    createAnnouncer({ politeness: 'polite' });
    createAnnouncer({ politeness: 'assertive' });

    expect(getAnnouncerCount()).toBe(2);

    clearAllAnnouncers();

    expect(getAnnouncerCount()).toBe(0);
  });
});

describe('getAnnouncerCount', () => {
  beforeEach(() => {
    clearAllAnnouncers();
  });

  afterEach(() => {
    clearAllAnnouncers();
  });

  it('returns count of active announcers', () => {
    expect(getAnnouncerCount()).toBe(0);

    const announcer1 = createAnnouncer({ politeness: 'polite' });
    expect(getAnnouncerCount()).toBe(1);

    const announcer2 = createAnnouncer({ politeness: 'assertive' });
    expect(getAnnouncerCount()).toBe(2);

    announcer1.destroy();
    expect(getAnnouncerCount()).toBe(1);

    announcer2.destroy();
    expect(getAnnouncerCount()).toBe(0);
  });
});
