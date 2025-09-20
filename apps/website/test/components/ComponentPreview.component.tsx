/**
 * ComponentPreview Component Tests
 *
 * Tests the ComponentPreview component functionality with ACTUAL components from the UI package:
 * - Card, Button, Badge, Input, Grid, Container, etc.
 * - Shadow DOM rendering
 * - Component registry loading from UI package
 * - Error handling
 * - Intelligence metadata display
 */

import { expect, test } from '@playwright/experimental-ct-react';
import ComponentPreview from '../../src/components/ComponentPreview';

// Mock actual component data based on real components in UI package
const mockCardComponent = {
  name: 'card',
  meta: {
    rafters: {
      intelligence: {
        cognitiveLoad: 2,
        attentionEconomics: 'Neutral container: Content drives attention',
        trustBuilding: 'Consistent spacing, predictable interaction patterns',
      },
    },
  },
};

const mockButtonComponent = {
  name: 'button',
  meta: {
    rafters: {
      intelligence: {
        cognitiveLoad: 3,
        attentionEconomics: 'Primary actions demand attention',
        trustBuilding: 'Consistent interaction feedback',
      },
    },
  },
};

const mockBadgeComponent = {
  name: 'badge',
  meta: {
    rafters: {
      intelligence: {
        cognitiveLoad: 1,
        attentionEconomics: 'Subtle metadata indicators',
        trustBuilding: 'Clear status communication',
      },
    },
  },
};

const mockContainerComponent = {
  name: 'container',
  meta: {
    rafters: {
      intelligence: {
        cognitiveLoad: 1,
        attentionEconomics: 'Invisible structure',
        trustBuilding: 'Structural consistency',
      },
    },
  },
};

const mockGridComponent = {
  name: 'grid',
  meta: {
    rafters: {
      intelligence: {
        cognitiveLoad: 2,
        attentionEconomics: 'Organized spatial layout',
        trustBuilding: 'Predictable organization',
      },
    },
  },
};

test.describe('ComponentPreview with Real UI Components', () => {
  test('should load and render Card component', async ({ mount, page }) => {
    // Mock the registry API endpoint for Card
    await page.route('/registry/components/card.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCardComponent),
      });
    });

    const component = await mount(<ComponentPreview component="card" variant="default" />);

    // Wait for component to load
    await expect(component.locator('#shadow-container')).toBeVisible();

    // Should have correct data attributes
    await expect(component).toHaveAttribute('data-component', 'card');
    await expect(component).toHaveAttribute('data-variant', 'default');

    // Should have preview controls
    await expect(component.getByText('Reload')).toBeVisible();
    await expect(component.getByText('View Code')).toBeVisible();
  });

  test('should render Button component with primary variant', async ({ mount, page }) => {
    await page.route('/registry/components/button.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockButtonComponent),
      });
    });

    const component = await mount(<ComponentPreview component="button" variant="primary" />);
    await expect(component.locator('#shadow-container')).toBeVisible();
    await expect(component).toHaveAttribute('data-variant', 'primary');
  });

  test('should render Button component with secondary variant', async ({ mount, page }) => {
    await page.route('/registry/components/button.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockButtonComponent),
      });
    });

    const component = await mount(<ComponentPreview component="button" variant="secondary" />);
    await expect(component.locator('#shadow-container')).toBeVisible();
    await expect(component).toHaveAttribute('data-variant', 'secondary');
  });

  test('should render Button component with destructive variant', async ({ mount, page }) => {
    await page.route('/registry/components/button.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockButtonComponent),
      });
    });

    const component = await mount(<ComponentPreview component="button" variant="destructive" />);
    await expect(component.locator('#shadow-container')).toBeVisible();
    await expect(component).toHaveAttribute('data-variant', 'destructive');
  });

  test('should display intelligence metadata for Badge', async ({ mount, page }) => {
    await page.route('/registry/components/badge.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBadgeComponent),
      });
    });

    const component = await mount(
      <ComponentPreview component="badge" variant="default" showIntelligence={true} />
    );

    // Should display intelligence metadata
    await expect(component.locator('.preview-intelligence')).toBeVisible();
    // Use more specific locator for the intelligence section to avoid duplicates
    const intelligenceSection = component.locator('.preview-intelligence');
    await expect(intelligenceSection).toContainText('Cognitive Load: 1/10');
    await expect(intelligenceSection).toContainText('Subtle metadata indicators');
    await expect(intelligenceSection).toContainText('Clear status communication');
  });

  test('should render Container component', async ({ mount, page }) => {
    await page.route('/registry/components/container.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockContainerComponent),
      });
    });

    const component = await mount(<ComponentPreview component="container" variant="default" />);

    await expect(component.locator('#shadow-container')).toBeVisible();
    await expect(component).toHaveAttribute('data-component', 'container');
  });

  test('should render Grid component', async ({ mount, page }) => {
    await page.route('/registry/components/grid.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGridComponent),
      });
    });

    const component = await mount(<ComponentPreview component="grid" variant="default" />);

    await expect(component.locator('#shadow-container')).toBeVisible();
    await expect(component).toHaveAttribute('data-component', 'grid');
  });

  test('should handle component not found error', async ({ mount, page }) => {
    // Mock 404 for non-existent component
    await page.route('/registry/components/nonexistent.json', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Component not found' }),
      });
    });

    const component = await mount(<ComponentPreview component="nonexistent" variant="default" />);

    // Should show error state
    await expect(component.locator('.preview-error')).toBeVisible();
    await expect(component.getByText('Component Error')).toBeVisible();
    await expect(component.getByText(/Component nonexistent not found/)).toBeVisible();
  });

  test('should handle custom props for components', async ({ mount, page }) => {
    await page.route('/registry/components/button.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockButtonComponent),
      });
    });

    const component = await mount(
      <ComponentPreview
        component="button"
        variant="primary"
        props='{"children": "Click me!", "disabled": false}'
      />
    );

    await expect(component.locator('#shadow-container')).toBeVisible();
  });

  test('should handle custom height and className', async ({ mount, page }) => {
    await page.route('/registry/components/card.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCardComponent),
      });
    });

    const component = await mount(
      <ComponentPreview
        component="card"
        variant="default"
        height="400px"
        className="test-preview-class"
      />
    );

    await expect(component.locator('#shadow-container')).toBeVisible();

    // Check custom height
    const container = component.locator('.preview-container');
    await expect(container).toHaveCSS('height', '400px');

    // Check custom className
    await expect(component).toHaveClass(/test-preview-class/);
  });

  test('should display reload button', async ({ mount, page }) => {
    await page.route('/registry/components/badge.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBadgeComponent),
      });
    });

    const component = await mount(<ComponentPreview component="badge" variant="default" />);

    // Wait for initial load
    await expect(component.locator('#shadow-container')).toBeVisible();

    // Reload button should be visible and enabled
    const reloadButton = component.getByText('Reload');
    await expect(reloadButton).toBeVisible();
    await expect(reloadButton).toBeEnabled();
  });

  test('should handle view code button', async ({ mount, page }) => {
    await page.route('/registry/components/input.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'input',
          meta: {
            rafters: {
              intelligence: {
                cognitiveLoad: 2,
                attentionEconomics: 'Focus management',
                trustBuilding: 'Clear input feedback',
              },
            },
          },
        }),
      });
    });

    const component = await mount(<ComponentPreview component="input" variant="default" />);

    await expect(component.locator('#shadow-container')).toBeVisible();

    // Setup console spy
    let consoleMessage = '';
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleMessage = msg.text();
      }
    });

    // Click view code
    await component.getByText('View Code').click();
    expect(consoleMessage).toContain('View code for: input');
  });

  test('should handle missing intelligence metadata gracefully', async ({ mount, page }) => {
    // Component without intelligence metadata
    await page.route('/registry/components/simple.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'simple',
        }),
      });
    });

    const component = await mount(
      <ComponentPreview component="simple" variant="default" showIntelligence={true} />
    );

    await expect(component.locator('#shadow-container')).toBeVisible();

    // Should not show intelligence section when metadata is missing
    await expect(component.locator('.preview-intelligence')).not.toBeVisible();
  });

  test('should handle network errors gracefully', async ({ mount, page }) => {
    // Simulate network failure
    await page.route('/registry/components/network-fail.json', async (route) => {
      await route.abort('failed');
    });

    const component = await mount(<ComponentPreview component="network-fail" variant="default" />);

    // Should show error state
    await expect(component.locator('.preview-error')).toBeVisible();
    await expect(component.getByText('Component Error')).toBeVisible();
  });

  test('should render unknown components with fallback', async ({ mount, page }) => {
    // Component not in the hardcoded switch statement
    await page.route('/registry/components/tooltip.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'tooltip',
          meta: {
            rafters: {
              intelligence: {
                cognitiveLoad: 2,
                attentionEconomics: 'On-demand information',
                trustBuilding: 'Progressive disclosure',
              },
            },
          },
        }),
      });
    });

    const component = await mount(<ComponentPreview component="tooltip" variant="default" />);

    await expect(component.locator('#shadow-container')).toBeVisible();
    // Should render with placeholder since tooltip isn't in the switch statement
  });
});
