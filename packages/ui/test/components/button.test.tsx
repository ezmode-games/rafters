import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button from '../../src/components/ui/button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument();
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('applies variant and size classes', () => {
    render(
      <div>
        <Button variant="secondary" size="lg">
          Ok
        </Button>
      </div>,
    );

    const btn = screen.getByRole('button');
    // class presence rather than exact string to avoid brittle ordering
    expect(btn.className).toContain('bg-secondary');
    expect(btn.className).toContain('px-6');
  });

  it('supports semantic variants and outline', () => {
    render(
      <div>
        <Button variant="info">Info</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warn</Button>
        <Button variant="alert">Alert</Button>
        <Button variant="outline">Outline</Button>
      </div>,
    );

    expect(screen.getByText('Info').className).toContain('bg-info');
    expect(screen.getByText('Success').className).toContain('bg-success');
    expect(screen.getByText('Warn').className).toContain('bg-warning');
    expect(screen.getByText('Alert').className).toContain('bg-alert');
    expect(screen.getByText('Outline').className).toContain('border');
  });

  it('forwards onClick and respects disabled', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();

    render(
      <div>
        <Button onClick={spy}>Go</Button>
        <Button disabled onClick={spy}>
          No
        </Button>
      </div>,
    );

    await user.click(screen.getByText('Go'));
    expect(spy).toHaveBeenCalled();

    await user.click(screen.getByText('No'));
    expect(spy).toHaveBeenCalledTimes(1); // disabled should not call again
  });

  it('asChild anchor respects disabled and sets aria-disabled', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();

    render(
      <div>
        <Button asChild>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              spy();
            }}
          >
            Link
          </button>
        </Button>
        <Button asChild disabled>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              spy();
            }}
          >
            Disabled
          </button>
        </Button>
      </div>,
    );

    await user.click(screen.getByText('Link'));
    expect(spy).toHaveBeenCalled();

    await user.click(screen.getByText('Disabled'));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Disabled')).toHaveAttribute('aria-disabled', 'true');
  });

  it('supports asChild pattern', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();

    render(
      <Button asChild>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            spy();
          }}
        >
          Link
        </button>
      </Button>,
    );

    await user.click(screen.getByText('Link'));
    expect(spy).toHaveBeenCalled();
  });
});
