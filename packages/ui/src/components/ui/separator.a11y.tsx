import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Separator } from './separator';

describe('Separator - Accessibility', () => {
  it('has no accessibility violations when decorative', async () => {
    const { container } = render(<Separator decorative={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when semantic', async () => {
    const { container } = render(<Separator decorative={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations in vertical orientation', async () => {
    const { container } = render(<Separator orientation="vertical" decorative={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});