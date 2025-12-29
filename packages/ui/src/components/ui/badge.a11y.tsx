import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './badge';

describe('Badge - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>Status</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations with all variants', async () => {
    const variants = ['default', 'secondary', 'destructive', 'success', 'warning', 'info', 'outline'] as const;
    for (const variant of variants) {
      const { container } = render(<Badge variant={variant}>Test</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });
});