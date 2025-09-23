/**
 * Test the event-driven registry system
 */

import { describe, expect, it, vi } from 'vitest';
import { TokenRegistry } from '../src/registry.js';
import type { RegistryEvent } from '../src/types/events.js';

describe('Event-Driven Registry', () => {
  it('should fire callback when token is updated', () => {
    const registry = new TokenRegistry();
    const mockCallback = vi.fn();

    // Add a token
    registry.add({
      name: 'primary',
      value: 'oklch(0.45 0.12 240)',
      category: 'color',
      namespace: 'semantic',
    });

    // Set callback
    registry.setChangeCallback(mockCallback);

    // Update token
    registry.updateToken('primary', 'oklch(0.50 0.12 240)');

    // Verify callback was called
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      type: 'token-changed',
      tokenName: 'primary',
      oldValue: 'oklch(0.45 0.12 240)',
      newValue: 'oklch(0.50 0.12 240)',
      timestamp: expect.any(Number),
    });
  });

  it('should fire callback when multiple tokens are updated', () => {
    const registry = new TokenRegistry();
    const mockCallback = vi.fn();

    // Add tokens
    registry.add({
      name: 'primary',
      value: 'oklch(0.45 0.12 240)',
      category: 'color',
      namespace: 'semantic',
    });

    registry.add({
      name: 'secondary',
      value: 'oklch(0.65 0.10 120)',
      category: 'color',
      namespace: 'semantic',
    });

    // Set callback
    registry.setChangeCallback(mockCallback);

    // Update multiple tokens
    registry.updateMultipleTokens([
      { name: 'primary', value: 'oklch(0.50 0.12 240)' },
      { name: 'secondary', value: 'oklch(0.70 0.10 120)' },
    ]);

    // Verify callback was called
    expect(mockCallback).toHaveBeenCalledTimes(1);
    const event = mockCallback.mock.calls[0][0] as RegistryEvent;
    expect(event.type).toBe('tokens-batch-changed');
    expect(event).toHaveProperty('changes');
    if (event.type === 'tokens-batch-changed') {
      expect(event.changes).toHaveLength(2);
    }
  });

  it('should fire registry initialized event', () => {
    const registry = new TokenRegistry();
    const mockCallback = vi.fn();

    registry.setChangeCallback(mockCallback);

    // Initialize registry
    registry.initializeRegistry(42);

    // Verify callback was called
    expect(mockCallback).toHaveBeenCalledWith({
      type: 'registry-initialized',
      tokenCount: 42,
      timestamp: expect.any(Number),
    });
  });

  it('should not fire callback when no callback is set', () => {
    const registry = new TokenRegistry();

    // Add a token
    registry.add({
      name: 'primary',
      value: 'oklch(0.45 0.12 240)',
      category: 'color',
      namespace: 'semantic',
    });

    // Update token without callback - should not throw
    expect(() => {
      registry.updateToken('primary', 'oklch(0.50 0.12 240)');
    }).not.toThrow();
  });
});
