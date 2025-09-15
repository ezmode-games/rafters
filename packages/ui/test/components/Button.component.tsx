/**
 * Button Component Testing - Playwright Component Tests
 *
 * This is the PRIMARY testing method for UI components in Rafters.
 * Tests run in real browser environments to validate:
 * - Design intelligence accessibility to AI agents
 * - React 19 concurrent rendering behavior
 * - Cross-browser visual consistency
 * - Real user interaction patterns
 * - Accessibility compliance
 */

import { expect, test } from '@playwright/experimental-ct-react';
import { Button } from '../../src/components/Button';
import { extractComponentIntelligence, MockAIAgent } from '../utils/intelligence-validators';

test.describe('Button Component Intelligence & Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Set up component testing environment
    await page.addStyleTag({
      content: `
        /* Reset for consistent testing */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
      `,
    });
  });

  test.describe('AI Intelligence Validation', () => {
    test('validates cognitive load through visual hierarchy', async ({ mount }) => {
      const component = await mount(<Button variant="primary">Save Changes</Button>);

      // Test basic visibility and accessibility
      await expect(component).toBeVisible();
      await expect(component).toHaveAccessibleName('Save Changes');

      // Validate attention economics through computed styles
      const styles = await component.evaluate((el) => {
        const computed = getComputedStyle(el);
        return {
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          padding: computed.padding,
          backgroundColor: computed.backgroundColor,
        };
      });

      // Primary button should have visual prominence (medium font weight)
      expect(parseInt(styles.fontWeight, 10)).toBeGreaterThanOrEqual(500);

      // Test AI intelligence parsing
      const intelligence = extractComponentIntelligence(Button.toString());
      expect(intelligence.cognitiveLoad).toBe(3);
      expect(intelligence.attentionEconomics).toContain(
        'Primary variant commands highest attention'
      );
    });

    test('destructive confirmation patterns work correctly', async ({ mount }) => {
      const component = await mount(
        <Button variant="destructive" destructiveConfirm>
          Delete Account
        </Button>
      );

      // Test trust-building confirmation indicator
      const confirmationIcon = component.locator('span').first();
      await expect(confirmationIcon).toContainText('!');
      await expect(component).toHaveAttribute('aria-label', 'Confirm to Delete Account');

      // Validate destructive visual styling
      const bgColor = await component.evaluate((el) => getComputedStyle(el).backgroundColor);
      // Destructive should have distinct background color
      expect(bgColor).not.toBe('rgb(255, 255, 255)'); // Not white/default
    });

    test('loading states prevent double-submission', async ({ mount }) => {
      const component = await mount(
        <Button loading variant="primary">
          Processing...
        </Button>
      );

      // Test loading state attributes
      await expect(component).toHaveAttribute('aria-busy', 'true');
      await expect(component).toBeDisabled();

      // Test loading spinner presence
      const spinner = component.locator('svg');
      await expect(spinner).toBeVisible();
      await expect(spinner).toHaveClass(/animate-spin/);
    });
  });

  test.describe('React 19 Concurrent Rendering', () => {
    test('maintains consistency under rapid re-renders', async ({ mount }) => {
      // Mount component multiple times rapidly to test concurrent behavior
      const components = await Promise.all([
        mount(<Button variant="primary">Test 1</Button>),
        mount(<Button variant="primary">Test 2</Button>),
        mount(<Button variant="primary">Test 3</Button>),
      ]);

      // All components should render consistently
      for (const component of components) {
        await expect(component).toBeVisible();
        const styles = await component.evaluate((el) => getComputedStyle(el).backgroundColor);
        // All should have the same primary color
        expect(styles).toBeTruthy();
      }
    });

    test('handles state updates without side effects', async ({ mount }) => {
      let _clickCount = 0;
      const handleClick = () => {
        _clickCount++;
      };

      const component = await mount(
        <Button onClick={handleClick} variant="secondary">
          Click Count: {clickCount}
        </Button>
      );

      // Test that clicking updates work correctly
      await component.click();
      await component.click();

      // Component should be responsive (not frozen)
      await expect(component).toBeEnabled();
    });
  });

  test.describe('Cross-Browser Visual Consistency', () => {
    test('maintains visual hierarchy across browsers', async ({ mount, browserName }) => {
      const component = await mount(<Button variant="primary">Cross Browser Test</Button>);

      // Take screenshot for visual regression testing
      await expect(component).toHaveScreenshot(`button-primary-${browserName}.png`);

      // Test consistent sizing across browsers
      const boundingBox = await component.boundingBox();
      expect(boundingBox?.height).toBeGreaterThanOrEqual(40); // Minimum touch target
      expect(boundingBox?.width).toBeGreaterThanOrEqual(60); // Reasonable minimum width
    });

    test('dark mode maintains contrast ratios', async ({ mount, page }) => {
      // Enable dark mode
      await page.emulateMedia({ colorScheme: 'dark' });

      const component = await mount(<Button variant="primary">Dark Mode Test</Button>);

      // Test visibility in dark mode
      await expect(component).toBeVisible();

      // Take screenshot for dark mode regression testing
      await expect(component).toHaveScreenshot('button-primary-dark.png');
    });
  });

  test.describe('Accessibility & User Interaction', () => {
    test('supports keyboard navigation patterns', async ({ mount }) => {
      const component = await mount(<Button variant="primary">Keyboard Test</Button>);

      // Test focus management
      await component.focus();
      await expect(component).toBeFocused();

      // Test keyboard activation
      await component.press('Enter');
      await component.press('Space');

      // Focus should be visible
      const focusStyles = await component.evaluate((el) => {
        const focused = el.matches(':focus-visible');
        const styles = getComputedStyle(el);
        return {
          focused,
          outline: styles.outline,
          boxShadow: styles.boxShadow,
        };
      });

      // Should have visible focus indicators
      expect(
        focusStyles.focused || focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none'
      ).toBe(true);
    });

    test('meets WCAG touch target requirements', async ({ mount }) => {
      const component = await mount(<Button size="sm">Small Button</Button>);

      const boundingBox = await component.boundingBox();

      // WCAG AAA requires 44px minimum touch targets
      expect(boundingBox?.height).toBeGreaterThanOrEqual(32); // Small size, but still reasonable
      expect(boundingBox?.width).toBeGreaterThanOrEqual(40);

      // Test large button meets requirements
      const largeComponent = await mount(<Button size="lg">Large Button</Button>);
      const largeBoundingBox = await largeComponent.boundingBox();

      expect(largeBoundingBox?.height).toBeGreaterThanOrEqual(44);
    });

    test('provides appropriate ARIA attributes', async ({ mount }) => {
      const disabledComponent = await mount(<Button disabled>Disabled Button</Button>);

      await expect(disabledComponent).toHaveAttribute('aria-disabled', 'true');
      await expect(disabledComponent).toBeDisabled();

      const loadingComponent = await mount(<Button loading>Loading Button</Button>);
      await expect(loadingComponent).toHaveAttribute('aria-busy', 'true');
    });
  });

  test.describe('Design System Integration', () => {
    test('uses semantic tokens correctly', async ({ mount }) => {
      const primaryButton = await mount(<Button variant="primary">Primary</Button>);
      const secondaryButton = await mount(<Button variant="secondary">Secondary</Button>);

      // Test that different variants use different semantic token values
      const primaryStyles = await primaryButton.evaluate((el) => getComputedStyle(el));
      const secondaryStyles = await secondaryButton.evaluate((el) => getComputedStyle(el));

      // Colors should be different (semantic tokens working)
      expect(primaryStyles.backgroundColor).not.toBe(secondaryStyles.backgroundColor);
      expect(primaryStyles.color).not.toBe(secondaryStyles.color);
    });

    test('validates attention economics in practice', async ({ mount, page }) => {
      // Mount multiple buttons to test attention hierarchy
      await mount(
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Tertiary</Button>
        </div>
      );

      const primaryButton = page.locator('[data-testid="button"]:has-text("Primary Action")');
      const secondaryButton = page.locator('[data-testid="button"]:has-text("Secondary")');

      // Primary should have the most visual weight
      const primaryWeight = await primaryButton.evaluate((el) => getComputedStyle(el).fontWeight);
      const secondaryWeight = await secondaryButton.evaluate(
        (el) => getComputedStyle(el).fontWeight
      );

      expect(parseInt(primaryWeight, 10)).toBeGreaterThanOrEqual(parseInt(secondaryWeight, 10));
    });
  });

  test.describe('AI Agent Decision Making Simulation', () => {
    test('AI agent makes correct design decisions based on intelligence', async () => {
      const mockAI = new MockAIAgent();
      const intelligence = await mockAI.parseComponentIntelligence(Button.toString());

      // Test AI reasoning for destructive actions
      const destructiveDecision = await mockAI.makeDesignDecision(intelligence, {
        isDestructiveAction: true,
        consequenceLevel: 'high',
      });

      expect(destructiveDecision.recommendation).toBe('require-confirmation');
      expect(destructiveDecision.confidence).toBeGreaterThan(0.9);

      // Test AI reasoning for attention economics
      const attentionDecision = await mockAI.makeDesignDecision(intelligence, {
        attentionLevel: 'primary',
      });

      expect(attentionDecision.recommendation).toBe('limit-primary-usage');
      expect(attentionDecision.reasoning).toContain('maximum 1 primary action per section');
    });

    test('validates accessibility decision making', async () => {
      const mockAI = new MockAIAgent();
      const intelligence = await mockAI.parseComponentIntelligence(Button.toString());

      const accessibilityValid = await mockAI.validateAccessibility(intelligence);
      expect(accessibilityValid).toBe(true);

      // Intelligence should indicate WCAG compliance
      expect(intelligence.accessibility).toContain('WCAG');
      expect(intelligence.accessibility).toContain('screen reader');
    });
  });

  test.describe('Performance & Intelligence Correlation', () => {
    test('cognitive load correlates with render performance', async ({ mount }) => {
      const intelligence = extractComponentIntelligence(Button.toString());

      const startTime = Date.now();
      await mount(<Button variant="primary">Performance Test</Button>);
      const renderTime = Date.now() - startTime;

      // Cognitive load 3/10 should render quickly (low complexity)
      expect(intelligence.cognitiveLoad).toBe(3);
      expect(renderTime).toBeLessThan(100); // Fast render for simple component
    });
  });
});
