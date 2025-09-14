import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import ComponentPreview from '../../src/components/ComponentPreview.tsx';

/**
 * Playwright Component Tests for ComponentPreview
 *
 * Uses Playwright's new component testing to test the ComponentPreview
 * in an isolated browser environment with real Shadow DOM
 */

test.describe('ComponentPreview Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the registry API
    await page.route('/registry/components/button.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'button',
          type: 'registry:component',
          meta: {
            rafters: {
              intelligence: {
                cognitiveLoad: 3,
                attentionEconomics: 'Primary variant commands highest attention',
                trustBuilding: 'Destructive actions require confirmation patterns',
              },
            },
          },
        }),
      });
    });

    await page.route('/registry/components/container.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'container',
          type: 'registry:component',
          meta: {
            rafters: {
              intelligence: {
                cognitiveLoad: 0,
                attentionEconomics: 'Neutral structural element',
                trustBuilding: 'Predictable boundaries',
              },
            },
          },
        }),
      });
    });
  });

  test('should render button component with primary variant', async ({ mount }) => {
    const component = await mount(
      <ComponentPreview component="button" variant="primary" props='{"children": "Test Button"}' />
    );

    // Wait for component to fully load and render
    await expect(component.locator('#shadow-container')).toBeVisible();

    // Check that the shadow container exists
    await expect(component.locator('#shadow-container')).toBeVisible();
    await expect(component.locator('[data-component="button"]')).toBeVisible();
    await expect(component.locator('[data-variant="primary"]')).toBeVisible();
  });

  test('should display component intelligence when enabled', async ({ mount }) => {
    const component = await mount(
      <ComponentPreview component="button" variant="primary" showIntelligence={true} />
    );

    // Wait for loading to complete
    await expect(component.locator('.preview-loading')).not.toBeVisible({ timeout: 5000 });

    // Check intelligence display
    await expect(component.locator('.preview-intelligence')).toBeVisible();
    await expect(component.locator('.preview-intelligence')).toContainText('Cognitive Load: 3/10');
    await expect(component.locator('.preview-intelligence')).toContainText(
      'Primary variant commands highest attention'
    );
  });

  test('should handle different component types', async ({ mount }) => {
    const component = await mount(
      <ComponentPreview component="container" showIntelligence={true} />
    );

    // Wait for loading
    await expect(component.locator('.preview-loading')).not.toBeVisible({ timeout: 5000 });

    // Check container-specific intelligence
    await expect(component.locator('.preview-intelligence')).toContainText('Cognitive Load: 0/10');
    await expect(component.locator('.preview-intelligence')).toContainText(
      'Neutral structural element'
    );
  });

  test('should show error state for non-existent component', async ({ mount, page }) => {
    // Mock 404 response
    await page.route('/registry/components/non-existent.json', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Component not found' }),
      });
    });

    const component = await mount(<ComponentPreview component="non-existent" />);

    // Wait for error state
    await expect(component.locator('.preview-error')).toBeVisible({ timeout: 5000 });
    await expect(component.locator('.preview-error')).toContainText(
      'Component non-existent not found'
    );
  });

  test('should have functional control buttons', async ({ mount }) => {
    const component = await mount(<ComponentPreview component="button" variant="primary" />);

    // Wait for loading
    await expect(component.locator('.preview-loading')).not.toBeVisible({ timeout: 5000 });

    // Check control buttons exist and are clickable
    await expect(component.locator('.reload-btn')).toBeVisible();
    await expect(component.locator('.view-code-btn')).toBeVisible();

    // Test button functionality
    await component.locator('.view-code-btn').click();
    // Button should be clickable without errors
  });

  test('should create isolated Shadow DOM environment', async ({ mount, page }) => {
    const component = await mount(<ComponentPreview component="button" variant="primary" />);

    // Wait for component to load
    await expect(component.locator('.preview-loading')).not.toBeVisible({ timeout: 5000 });

    // Test that Shadow DOM is created
    const shadowContainer = component.locator('#shadow-container');
    await expect(shadowContainer).toBeVisible();

    // Verify Shadow DOM isolation by checking that styles don't leak
    // The shadow container should have a shadow root attached
    const hasShadowRoot = await page.evaluate(() => {
      const container = document.getElementById('shadow-container');
      return container?.shadowRoot !== null;
    });

    expect(hasShadowRoot).toBe(true);
  });

  test('should handle component interactions within Shadow DOM', async ({ mount, page }) => {
    const component = await mount(
      <ComponentPreview component="button" variant="primary" props='{"children": "Click me"}' />
    );

    // Wait for loading
    await expect(component.locator('.preview-loading')).not.toBeVisible({ timeout: 5000 });

    // Test clicking the button within Shadow DOM
    await page.evaluate(() => {
      const container = document.getElementById('shadow-container');
      const shadowRoot = container?.shadowRoot;
      const button = shadowRoot?.querySelector('.rafters-button');
      if (button) {
        (button as HTMLElement).click();
      }
    });

    // Verify interaction was handled
    const buttonClicked = await page.evaluate(() => {
      const container = document.getElementById('shadow-container');
      const shadowRoot = container?.shadowRoot;
      const button = shadowRoot?.querySelector('.rafters-button');
      return button?.getAttribute('data-clicked') === 'true';
    });

    expect(buttonClicked).toBe(true);
  });
});
