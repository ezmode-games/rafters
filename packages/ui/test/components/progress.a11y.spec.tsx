/**
 * Progress Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import { Progress } from '../../src/components/ui/progress';
import { analyzeA11y } from '../a11y-utils';

test.describe('Progress - Accessibility @a11y', () => {
  test('has no accessibility violations', async ({ mount, page }) => {
    await mount(<Progress value={50} aria-label="Loading" />);
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has no violations when indeterminate', async ({ mount, page }) => {
    await mount(<Progress aria-label="Loading" />);
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has correct progressbar role', async ({ mount, page }) => {
    await mount(<Progress value={50} aria-label="Loading" />);
    const progress = page.getByRole('progressbar');
    await expect(progress).toHaveCount(1);
  });

  test('forwards aria-label to native progress', async ({ mount, page }) => {
    await mount(<Progress value={50} aria-label="Download progress" />);
    const progress = page.locator('progress');
    await expect(progress).toHaveAttribute('aria-label', 'Download progress');
  });

  test('forwards aria-labelledby to native progress', async ({ mount, page }) => {
    await mount(
      <div>
        <span id="progress-label">File upload</span>
        <Progress value={50} aria-labelledby="progress-label" />
      </div>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('forwards aria-describedby to native progress', async ({ mount, page }) => {
    await mount(
      <div>
        <Progress value={50} aria-label="Upload" aria-describedby="progress-desc" />
        <p id="progress-desc">Uploading file to server</p>
      </div>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has correct aria-valuenow', async ({ mount, page }) => {
    await mount(<Progress value={75} aria-label="Loading" />);
    const progress = page.locator('progress');
    await expect(progress).toHaveAttribute('aria-valuenow', '75');
  });

  test('has correct aria-valuemax', async ({ mount, page }) => {
    await mount(<Progress value={50} max={200} aria-label="Loading" />);
    const progress = page.locator('progress');
    await expect(progress).toHaveAttribute('aria-valuemax', '200');
  });

  test('has aria-valuetext for screen readers', async ({ mount, page }) => {
    await mount(<Progress value={50} aria-label="Loading" />);
    const progress = page.locator('progress');
    await expect(progress).toHaveAttribute('aria-valuetext', '50%');
  });
});
