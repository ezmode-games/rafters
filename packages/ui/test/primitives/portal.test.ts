import { describe, expect, it } from 'vitest';
import { getPortalContainer, isPortalSupported } from '../../src/primitives/portal';

describe('portal', () => {
  it('returns a container when provided and is supported in test env', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const container = getPortalContainer({ container: el });
    expect(container).toBe(el);
    expect(isPortalSupported()).toBe(true);
  });
});
