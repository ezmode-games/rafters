/**
 * Sheet component accessibility tests
 * Tests ARIA attributes, focus management, and keyboard navigation
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from '../../src/components/ui/sheet';

describe('Sheet - Accessibility', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('has no accessibility violations when open', async () => {
    const { container } = render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetOverlay />
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description text</SheetDescription>
            </SheetHeader>
            <p>Sheet content goes here</p>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when closed', async () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has correct role="dialog"', async () => {
    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('has aria-modal="true" for modal sheets', async () => {
    render(
      <Sheet defaultOpen modal>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Modal Sheet</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });

  it('has aria-labelledby pointing to title', async () => {
    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>My Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      const titleId = dialog.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();

      const title = document.getElementById(titleId as string);
      expect(title).toHaveTextContent('My Title');
    });
  });

  it('has aria-describedby pointing to description', async () => {
    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>My description text</SheetDescription>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      const descriptionId = dialog.getAttribute('aria-describedby');
      expect(descriptionId).toBeTruthy();

      const description = document.getElementById(descriptionId as string);
      expect(description).toHaveTextContent('My description text');
    });
  });

  it('trigger has correct aria-expanded attribute', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });

    // Initially closed
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Open sheet
    await user.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('trigger has aria-haspopup="dialog"', () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('trigger has aria-controls pointing to sheet content', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    const controlsId = trigger.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();

    await user.click(trigger);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('id', controlsId);
    });
  });

  it('focuses first focusable element when opened', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <button type="button">First Button</button>
            <button type="button">Second Button</button>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() => {
      // Focus should be on a button within the dialog
      const activeElement = document.activeElement;
      expect(activeElement?.tagName).toBe('BUTTON');
      // Focus should be within the dialog
      const dialog = screen.getByRole('dialog');
      expect(dialog.contains(activeElement)).toBe(true);
    });
  });

  it('traps focus within sheet', async () => {
    const user = userEvent.setup();

    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Focus Trap Test</SheetTitle>
            <button type="button">First</button>
            <button type="button">Second</button>
            <button type="button">Third</button>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    // Wait for sheet to open and some element to be focused
    await waitFor(() => {
      const activeElement = document.activeElement;
      expect(activeElement?.tagName).toBe('BUTTON');
    });

    const dialog = screen.getByRole('dialog');

    // Tab through all elements - verify focus stays within dialog
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);

    // Tab should wrap - focus should still be within dialog (focus trap working)
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('supports Shift+Tab for reverse focus navigation', async () => {
    const user = userEvent.setup();

    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Reverse Navigation Test</SheetTitle>
            <button type="button">First</button>
            <button type="button">Second</button>
            <button type="button">Third</button>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    // Wait for sheet to open
    await waitFor(() => {
      const activeElement = document.activeElement;
      expect(activeElement?.tagName).toBe('BUTTON');
    });

    const dialog = screen.getByRole('dialog');

    // Shift+Tab should wrap to last focusable element
    await user.keyboard('{Shift>}{Tab}{/Shift}');

    // Focus should still be within the dialog (focus trap working)
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('closes on Escape key press', async () => {
    const user = userEvent.setup();

    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Escape Test</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('returns focus to trigger on close', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Focus Return Test</SheetTitle>
            <SheetClose data-testid="close-btn">Close</SheetClose>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('close-btn'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('has data-state attribute for open/closed states', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>State Test</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('data-state', 'closed');

    await user.click(trigger);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('data-state', 'open');
      expect(trigger).toHaveAttribute('data-state', 'open');
    });
  });

  it('overlay has aria-hidden="true"', async () => {
    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetOverlay data-testid="overlay" />
          <SheetContent>
            <SheetTitle>Overlay Test</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await waitFor(() => {
      const overlay = screen.getByTestId('overlay');
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('works correctly with all side variants', async () => {
    // Test each side variant independently
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      const { container, unmount } = render(
        <Sheet defaultOpen>
          <SheetPortal>
            <SheetContent side={side}>
              <SheetTitle>{side} Sheet</SheetTitle>
              <SheetDescription>Description for {side}</SheetDescription>
            </SheetContent>
          </SheetPortal>
        </Sheet>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Properly unmount before next iteration
      unmount();
    }
  });
});
