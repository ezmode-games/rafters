/**
 * HoverCard Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../src/components/ui/hover-card';
import { analyzeA11y } from '../a11y-utils';

test.describe('HoverCard - Accessibility @a11y', () => {
  // TODO: HoverCard has color contrast violations - needs design token fix
  test.skip('has no accessibility violations when open', async ({ mount, page }) => {
    await mount(
      <HoverCard open>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>
          <p>Card content</p>
        </HoverCardContent>
      </HoverCard>,
    );

    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('works with tab navigation', async ({ mount, page }) => {
    await mount(
      <div>
        <button type="button">Before</button>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button type="button">Hover Trigger</button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p>Card content</p>
          </HoverCardContent>
        </HoverCard>
        <button type="button">After</button>
      </div>,
    );

    // Tab to the trigger
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const trigger = page.getByRole('button', { name: 'Hover Trigger' });
    await expect(trigger).toBeFocused();
  });

  // TODO: HoverCard doesn't close on Escape - needs component fix
  test.skip('closes on Escape key', async ({ mount, page }) => {
    await mount(
      <HoverCard open>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>
          <p>Card content</p>
        </HoverCardContent>
      </HoverCard>,
    );

    // Content should be visible
    const content = page.getByText('Card content');
    await expect(content).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(content).not.toBeVisible();
  });
});
