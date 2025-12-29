import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Skeleton } from './skeleton';

describe('Skeleton - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Skeleton aria-hidden="true" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations when used as loading placeholder', async () => {
    const { container } = render(
      <div role="status">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('includes motion-reduce class for reduced motion support', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('motion-reduce:animate-none');
  });
});