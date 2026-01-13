import { describe, expect, it } from 'vitest';
import { getPortalContainer, isPortalSupported } from '../../src/primitives/portal';

describe('portal - getPortalContainer', () => {
  it('returns document.body by default', () => {
    const container = getPortalContainer();
    expect(container).toBe(document.body);
  });

  it('returns custom container when provided', () => {
    const customContainer = document.createElement('div');
    const container = getPortalContainer({ container: customContainer });
    expect(container).toBe(customContainer);
  });

  it('returns null when enabled is false', () => {
    const container = getPortalContainer({ enabled: false });
    expect(container).toBeNull();
  });

  it('returns document.body when enabled is true', () => {
    const container = getPortalContainer({ enabled: true });
    expect(container).toBe(document.body);
  });

  it('returns null when container is null and enabled is false', () => {
    const container = getPortalContainer({ container: null, enabled: false });
    expect(container).toBeNull();
  });

  it('returns document.body when container is null but enabled', () => {
    const container = getPortalContainer({ container: null, enabled: true });
    expect(container).toBe(document.body);
  });
});

describe('portal - isPortalSupported', () => {
  it('returns true in browser environment', () => {
    expect(isPortalSupported()).toBe(true);
  });
});
