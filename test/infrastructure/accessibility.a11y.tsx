import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

describe('Accessibility Infrastructure', () => {
  it('detects no violations in accessible button', async () => {
    const { container } = render(<button type="button">Accessible Button</button>);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('validates axe is working correctly', async () => {
    const { container } = render(<button type="button">Accessible Button</button>);
    const results = await axe(container);
    expect(results).toBeDefined();
    expect(Array.isArray(results.violations)).toBe(true);
  });

  it('validates WCAG 2.1 AA compliance', async () => {
    const { container } = render(
      <button type="button" aria-label="Close dialog">
        X
      </button>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
