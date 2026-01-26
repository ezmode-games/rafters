/**
 * Slider Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import { Slider } from '../../src/components/ui/slider';
import { analyzeA11y } from '../a11y-utils';

test.describe('Slider - Accessibility @a11y', () => {
  test('has no accessibility violations with aria-label', async ({ mount, page }) => {
    await mount(<Slider aria-label="Volume" />);
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has no violations with custom value', async ({ mount, page }) => {
    await mount(<Slider defaultValue={[50]} aria-label="Volume" />);
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has no violations with range slider', async ({ mount, page }) => {
    await mount(<Slider defaultValue={[25, 75]} aria-label="Price range" />);
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has no violations when disabled', async ({ mount, page }) => {
    await mount(<Slider disabled aria-label="Disabled slider" />);
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has correct role="slider" on thumb', async ({ mount, page }) => {
    await mount(<Slider aria-label="Volume" />);
    const slider = page.getByRole('slider');
    await expect(slider).toHaveCount(1);
  });

  test('has correct aria-valuemin attribute', async ({ mount, page }) => {
    await mount(<Slider min={10} aria-label="Volume" />);
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-valuemin', '10');
  });

  test('has correct aria-valuemax attribute', async ({ mount, page }) => {
    await mount(<Slider max={200} aria-label="Volume" />);
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-valuemax', '200');
  });

  test('has correct aria-valuenow attribute', async ({ mount, page }) => {
    await mount(<Slider defaultValue={[42]} aria-label="Volume" />);
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-valuenow', '42');
  });

  test('has aria-orientation on thumb for vertical', async ({ mount, page }) => {
    await mount(<Slider orientation="vertical" aria-label="Volume" />);
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('has aria-disabled on thumb when disabled', async ({ mount, page }) => {
    await mount(<Slider disabled aria-label="Volume" />);
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-disabled', 'true');
  });

  test('thumbs are focusable when not disabled', async ({ mount, page }) => {
    await mount(<Slider aria-label="Volume" />);
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('tabIndex', '0');
  });

  test('thumbs are not focusable when disabled', async ({ mount, page }) => {
    await mount(<Slider disabled aria-label="Volume" />);
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('tabIndex', '-1');
  });

  test('supports aria-labelledby', async ({ mount, page }) => {
    await mount(
      <div>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: Testing aria-labelledby pattern */}
        <label id="slider-label">Volume control</label>
        <Slider aria-labelledby="slider-label" />
      </div>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('supports aria-describedby', async ({ mount, page }) => {
    await mount(
      <div>
        <Slider aria-label="Volume" aria-describedby="slider-description" />
        <p id="slider-description">Adjust the volume level from 0 to 100</p>
      </div>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('each thumb in range slider has correct ARIA attributes', async ({ mount, page }) => {
    await mount(<Slider defaultValue={[25, 75]} min={0} max={100} aria-label="Price range" />);
    const sliders = page.getByRole('slider');
    await expect(sliders).toHaveCount(2);

    const first = sliders.nth(0);
    const second = sliders.nth(1);

    await expect(first).toHaveAttribute('aria-valuemin', '0');
    await expect(first).toHaveAttribute('aria-valuemax', '100');
    await expect(first).toHaveAttribute('aria-valuenow', '25');

    await expect(second).toHaveAttribute('aria-valuemin', '0');
    await expect(second).toHaveAttribute('aria-valuemax', '100');
    await expect(second).toHaveAttribute('aria-valuenow', '75');
  });

  test('has no violations with vertical orientation', async ({ mount, page }) => {
    await mount(<Slider orientation="vertical" aria-label="Vertical slider" />);
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });
});
