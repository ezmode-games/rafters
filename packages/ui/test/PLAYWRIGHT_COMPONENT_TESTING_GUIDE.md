# Playwright Component Testing Guide for Rafters UI

## Overview

This guide provides comprehensive best practices for testing Rafters UI components using Playwright Component Testing. Our component library uses a unique architecture: Lit-based Web Components (primitives) wrapped by React components.

## Architecture Understanding

### Two-Layer System

1. **r-button (Web Component Primitive)**
   - Built with Lit framework
   - Handles core functionality (keyboard, focus, events)
   - Framework-agnostic, can be used in any project
   - Location: `packages/ui/src/primitives/button/r-button.ts`

2. **Button (React Wrapper)**
   - Wraps `<r-button>` Web Component
   - Applies Tailwind classes for styling
   - Manages variant/size system
   - Location: `packages/ui/src/components/Button.tsx`

### Testing Strategy

**Test both layers comprehensively:**

- **Primitive tests**: Focus on core functionality, keyboard, ARIA, events
- **React wrapper tests**: Focus on props, styling, state management, visual variants

## Running Tests

```bash
# Run all component tests
pnpm --filter=@rafters/ui test:component

# Run in watch mode during development
pnpm --filter=@rafters/ui test:component --ui

# Run specific test file
pnpm --filter=@rafters/ui test:component button.component

# Debug tests with Playwright Inspector
pnpm --filter=@rafters/ui test:component --debug

# Generate test report
pnpm --filter=@rafters/ui test:component --reporter=html
```

## Best Practices

### 1. Test File Naming

```
test/components/[component-name].component.tsx
```

- Use `.component.tsx` extension (configured in playwright.config.component.ts)
- Place in `test/components/` directory
- Match the component name (e.g., `button.component.tsx` for Button)

### 2. Test Structure (AAA Pattern)

```typescript
test('should trigger click on Enter key', async ({ mount }) => {
  // ARRANGE: Set up component and state
  let clicked = false;
  const component = await mount(
    <r-button onClick={() => { clicked = true; }}>
      Press Enter
    </r-button>
  );

  // ACT: Perform user action
  await component.focus();
  await component.press('Enter');

  // ASSERT: Verify expected outcome
  expect(clicked).toBe(true);
});
```

### 3. Testing Web Components with Playwright

#### Mounting Web Components

```typescript
// Direct Web Component usage
const component = await mount(
  <r-button disabled>Disabled</r-button>
);

// Web Component with React event handlers
const component = await mount(
  <r-button onClick={() => { /* handler */ }}>
    Click Me
  </r-button>
);
```

#### Accessing Web Component Properties

```typescript
// Check reflected attributes
await expect(component).toHaveAttribute('disabled');
await expect(component).toHaveAttribute('role', 'button');

// Check internal state (if exposed via attributes)
await expect(component).toHaveAttribute('tabindex', '0');
```

#### Testing Web Component Shadow DOM (if used)

```typescript
// For components using Shadow DOM
const shadowRoot = await component.evaluateHandle(
  (el) => el.shadowRoot
);

// Query inside shadow DOM
const slotContent = shadowRoot.locator('slot');
await expect(slotContent).toBeVisible();
```

### 4. Keyboard Interaction Testing

#### Essential Keyboard Tests

```typescript
test.describe('Keyboard Interactions', () => {
  test('should trigger on Enter', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <r-button onClick={() => { clicked = true; }}>Enter</r-button>
    );

    await component.focus();
    await component.press('Enter');
    expect(clicked).toBe(true);
  });

  test('should trigger on Space', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <r-button onClick={() => { clicked = true; }}>Space</r-button>
    );

    await component.focus();
    await component.press('Space');
    expect(clicked).toBe(true);
  });

  test('should NOT trigger on other keys', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <r-button onClick={() => { clicked = true; }}>Other</r-button>
    );

    await component.focus();
    await component.press('a');
    await component.press('Escape');
    expect(clicked).toBe(false);
  });

  test('should prevent Space from scrolling page', async ({ mount, page }) => {
    const component = await mount(<r-button>No Scroll</r-button>);
    await component.focus();

    const scrollBefore = await page.evaluate(() => window.scrollY);
    await component.press('Space');
    const scrollAfter = await page.evaluate(() => window.scrollY);

    expect(scrollAfter).toBe(scrollBefore);
  });
});
```

#### Advanced Keyboard Patterns

```typescript
// Test keyboard navigation in lists
test('should navigate with arrow keys', async ({ mount }) => {
  const component = await mount(<MenuList items={['A', 'B', 'C']} />);

  const firstItem = component.locator('[data-index="0"]');
  const secondItem = component.locator('[data-index="1"]');

  await firstItem.focus();
  await firstItem.press('ArrowDown');

  await expect(secondItem).toBeFocused();
});

// Test Escape key handling
test('should close on Escape', async ({ mount }) => {
  const component = await mount(<Dialog open>Content</Dialog>);

  await component.press('Escape');
  await expect(component).not.toBeVisible();
});

// Test Tab key navigation
test('should trap focus with Tab', async ({ mount }) => {
  const component = await mount(
    <Modal>
      <button data-testid="first">First</button>
      <button data-testid="last">Last</button>
    </Modal>
  );

  const first = component.locator('[data-testid="first"]');
  const last = component.locator('[data-testid="last"]');

  await last.focus();
  await last.press('Tab');

  // Should cycle back to first element
  await expect(first).toBeFocused();
});
```

### 5. Focus Management Testing

```typescript
test.describe('Focus Management', () => {
  test('should be focusable by default', async ({ mount }) => {
    const component = await mount(<r-button>Focus</r-button>);

    await component.focus();
    await expect(component).toBeFocused();
  });

  test('should not be focusable when disabled', async ({ mount }) => {
    const component = await mount(<r-button disabled>Disabled</r-button>);

    await component.focus();
    await expect(component).not.toBeFocused();
  });

  test('should have visible focus indicator', async ({ mount }) => {
    const component = await mount(<Button>Focus</Button>);

    await component.focus();

    // Visual focus indicator check
    const className = await component.getAttribute('class');
    expect(className).toContain('focus-visible:ring-2');
  });

  test('should restore focus after interaction', async ({ mount }) => {
    const component = await mount(
      <div>
        <button data-testid="trigger">Trigger</button>
        <Dialog trigger="trigger">Content</Dialog>
      </div>
    );

    const trigger = component.locator('[data-testid="trigger"]');

    await trigger.focus();
    await trigger.click(); // Opens dialog

    const closeBtn = component.locator('[aria-label="Close"]');
    await closeBtn.click(); // Closes dialog

    // Focus should return to trigger
    await expect(trigger).toBeFocused();
  });
});
```

### 6. ARIA and Accessibility Testing

```typescript
test.describe('Accessibility', () => {
  // Role verification
  test('should have correct role', async ({ mount }) => {
    const component = await mount(<r-button>Button</r-button>);
    await expect(component).toHaveAttribute('role', 'button');
  });

  // Accessible name testing
  test('should have accessible name from content', async ({ mount }) => {
    const component = await mount(<r-button>Save</r-button>);
    await expect(component).toHaveAccessibleName('Save');
  });

  test('should use aria-label when provided', async ({ mount }) => {
    const component = await mount(
      <r-button aria-label="Save document">
        <IconSave />
      </r-button>
    );
    await expect(component).toHaveAccessibleName('Save document');
  });

  // State attributes
  test('should have aria-disabled when disabled', async ({ mount }) => {
    const component = await mount(<Button disabled>Disabled</Button>);
    // Note: r-button uses disabled attribute, not aria-disabled
    await expect(component).toHaveAttribute('disabled');
  });

  test('should have aria-busy when loading', async ({ mount }) => {
    const component = await mount(<Button loading>Loading</Button>);
    await expect(component).toHaveAttribute('aria-busy', 'true');
  });

  // Keyboard accessibility
  test('should be keyboard accessible', async ({ mount }) => {
    let activated = false;
    const component = await mount(
      <Button onClick={() => { activated = true; }}>Keyboard</Button>
    );

    await component.press('Tab'); // Navigate to button
    await component.press('Enter'); // Activate

    expect(activated).toBe(true);
  });

  // Screen reader text
  test('should provide descriptive text for screen readers', async ({ mount }) => {
    const component = await mount(
      <Button variant="destructive" destructiveConfirm>
        Delete Account
      </Button>
    );

    const ariaLabel = await component.getAttribute('aria-label');
    expect(ariaLabel).toContain('Confirm to Delete Account');
  });
});
```

### 7. Visual State Testing

```typescript
test.describe('Visual States', () => {
  test('should apply hover styles', async ({ mount }) => {
    const component = await mount(<Button>Hover</Button>);

    // Verify hover classes are present
    const className = await component.getAttribute('class');
    expect(className).toContain('hover:opacity-90');

    // Trigger hover and verify component is still functional
    await component.hover();
    await expect(component).toBeVisible();
  });

  test('should apply disabled opacity', async ({ mount }) => {
    const component = await mount(<Button disabled>Disabled</Button>);

    const className = await component.getAttribute('class');
    expect(className).toContain('disabled:opacity-50');
  });

  test('should apply loading styles', async ({ mount }) => {
    const component = await mount(<Button loading>Loading</Button>);

    const className = await component.getAttribute('class');
    expect(className).toContain('opacity-75');
    expect(className).toContain('cursor-wait');
  });

  test('should apply active/pressed state', async ({ mount }) => {
    const component = await mount(<Button>Press</Button>);

    const className = await component.getAttribute('class');
    expect(className).toContain('active:scale-95');
  });
});
```

### 8. Variant and Prop Testing

```typescript
test.describe('Variants', () => {
  // Test each variant systematically
  const variants = [
    'primary',
    'secondary',
    'destructive',
    'success',
    'warning',
    'info',
    'outline',
    'ghost'
  ] as const;

  for (const variant of variants) {
    test(`should render ${variant} variant correctly`, async ({ mount }) => {
      const component = await mount(
        <Button variant={variant}>{variant}</Button>
      );

      const className = await component.getAttribute('class');

      // Verify variant-specific class
      if (variant === 'outline') {
        expect(className).toContain('border');
      } else if (variant === 'ghost') {
        expect(className).toContain('hover:bg-accent');
      } else {
        expect(className).toContain(`bg-${variant}`);
      }
    });
  }
});

test.describe('Sizes', () => {
  const sizes = [
    { size: 'sm', height: 'h-8', padding: 'px-3' },
    { size: 'md', height: 'h-10', padding: 'px-4' },
    { size: 'lg', height: 'h-12', padding: 'px-6' },
    { size: 'full', height: 'h-12', width: 'w-full' }
  ] as const;

  for (const { size, height, padding, width } of sizes) {
    test(`should render ${size} size correctly`, async ({ mount }) => {
      const component = await mount(<Button size={size}>{size}</Button>);

      const className = await component.getAttribute('class');
      expect(className).toContain(height);
      expect(className).toContain(padding || '');
      if (width) {
        expect(className).toContain(width);
      }
    });
  }
});
```

### 9. Event Handler Testing

```typescript
test.describe('Event Handlers', () => {
  test('should call onClick handler', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <Button onClick={() => { clicked = true; }}>Click</Button>
    );

    await component.click();
    expect(clicked).toBe(true);
  });

  test('should call onClick multiple times', async ({ mount }) => {
    let count = 0;
    const component = await mount(
      <Button onClick={() => { count++; }}>Counter</Button>
    );

    await component.click();
    await component.click();
    await component.click();

    expect(count).toBe(3);
  });

  test('should pass event to handler', async ({ mount, page }) => {
    const component = await mount(
      <div>
        <Button id="test-btn">Event Test</Button>
      </div>
    );

    // Set up event listener that captures event details
    await page.evaluate(() => {
      const btn = document.getElementById('test-btn');
      btn?.addEventListener('click', (e) => {
        (window as any).clickEvent = {
          type: e.type,
          target: e.target?.tagName
        };
      });
    });

    const button = component.locator('#test-btn');
    await button.click();

    const eventDetails = await page.evaluate(() => (window as any).clickEvent);
    expect(eventDetails.type).toBe('click');
    expect(eventDetails.target).toBe('R-BUTTON');
  });

  test('should not call handler when disabled', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <Button disabled onClick={() => { clicked = true; }}>
        Disabled
      </Button>
    );

    await component.click({ force: true });
    expect(clicked).toBe(false);
  });
});
```

### 10. Snapshot and Visual Regression Testing

```typescript
test.describe('Visual Regression', () => {
  test('should match variant snapshot', async ({ mount }) => {
    const component = await mount(
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    );

    await expect(component).toHaveScreenshot('button-variants.png');
  });

  test('should match state snapshot', async ({ mount }) => {
    const component = await mount(
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>
    );

    await expect(component).toHaveScreenshot('button-states.png');
  });

  test('should match focus state snapshot', async ({ mount }) => {
    const component = await mount(<Button>Focus State</Button>);

    await component.focus();
    await expect(component).toHaveScreenshot('button-focused.png');
  });

  test('should match hover state snapshot', async ({ mount }) => {
    const component = await mount(<Button>Hover State</Button>);

    await component.hover();
    await expect(component).toHaveScreenshot('button-hovered.png');
  });
});
```

### 11. Testing Complex Interactions

```typescript
test.describe('Complex Interactions', () => {
  test('should handle rapid clicks correctly', async ({ mount }) => {
    let count = 0;
    const component = await mount(
      <Button onClick={() => { count++; }}>Rapid Click</Button>
    );

    // Simulate rapid clicking
    await component.click({ clickCount: 5 });

    // Should register all clicks
    expect(count).toBeGreaterThan(0);
  });

  test('should handle form submission', async ({ mount, page }) => {
    const component = await mount(
      <form data-testid="test-form">
        <input name="username" defaultValue="test" />
        <Button type="submit">Submit</Button>
      </form>
    );

    // Listen for form submit event
    await page.evaluate(() => {
      document.querySelector('[data-testid="test-form"]')?.addEventListener(
        'submit',
        (e) => {
          e.preventDefault();
          (window as any).formSubmitted = true;
        }
      );
    });

    const submitButton = component.locator('r-button');
    await submitButton.click();

    const formSubmitted = await page.evaluate(() => (window as any).formSubmitted);
    expect(formSubmitted).toBe(true);
  });

  test('should handle programmatic focus changes', async ({ mount }) => {
    const component = await mount(
      <div>
        <Button data-testid="first">First</Button>
        <Button data-testid="second">Second</Button>
      </div>
    );

    const first = component.locator('[data-testid="first"]');
    const second = component.locator('[data-testid="second"]');

    await first.focus();
    await expect(first).toBeFocused();

    await second.focus();
    await expect(second).toBeFocused();
    await expect(first).not.toBeFocused();
  });
});
```

### 12. Testing with Context Providers

```typescript
// For components that require React context
test('should work with theme context', async ({ mount }) => {
  const component = await mount(
    <ThemeProvider theme="dark">
      <Button>Themed Button</Button>
    </ThemeProvider>
  );

  // Verify button receives theme
  await expect(component).toBeVisible();
});

// For components requiring multiple providers
test('should work with multiple providers', async ({ mount }) => {
  const component = await mount(
    <ThemeProvider theme="dark">
      <ToastProvider>
        <Button onClick={() => showToast('Clicked')}>
          Show Toast
        </Button>
      </ToastProvider>
    </ThemeProvider>
  );

  await component.click();
  // Assert toast appears
});
```

### 13. Performance Testing

```typescript
test.describe('Performance', () => {
  test('should render quickly', async ({ mount }) => {
    const startTime = Date.now();

    await mount(<Button>Performance Test</Button>);

    const renderTime = Date.now() - startTime;

    // Assert render time is under threshold
    expect(renderTime).toBeLessThan(100); // 100ms
  });

  test('should handle many instances efficiently', async ({ mount }) => {
    const buttons = Array.from({ length: 100 }, (_, i) => (
      <Button key={i}>Button {i}</Button>
    ));

    const startTime = Date.now();
    const component = await mount(<div>{buttons}</div>);
    const renderTime = Date.now() - startTime;

    // Verify all buttons rendered
    const buttonElements = component.locator('r-button');
    await expect(buttonElements).toHaveCount(100);

    // Assert reasonable render time
    expect(renderTime).toBeLessThan(1000); // 1 second
  });
});
```

## Common Patterns

### Pattern 1: Testing Conditional Rendering

```typescript
test('should render loading spinner conditionally', async ({ mount }) => {
  const component = await mount(<Button>Normal</Button>);

  // Initially no spinner
  let spinner = component.locator('svg.animate-spin');
  await expect(spinner).not.toBeVisible();

  // Re-mount with loading prop
  const loadingComponent = await mount(<Button loading>Loading</Button>);
  spinner = loadingComponent.locator('svg.animate-spin');
  await expect(spinner).toBeVisible();
});
```

### Pattern 2: Testing Dynamic Props

```typescript
test('should update when props change', async ({ mount }) => {
  let disabled = false;

  const component = await mount(
    <Button disabled={disabled}>Dynamic</Button>
  );

  // Initially enabled
  await expect(component).not.toHaveAttribute('disabled');

  // Update prop
  disabled = true;
  await component.update(<Button disabled={disabled}>Dynamic</Button>);

  // Now disabled
  await expect(component).toHaveAttribute('disabled');
});
```

### Pattern 3: Testing with Test IDs

```typescript
test('should find elements by test ID', async ({ mount }) => {
  const component = await mount(
    <Button data-testid="submit-button">Submit</Button>
  );

  const button = component.locator('[data-testid="submit-button"]');
  await expect(button).toBeVisible();
  await expect(button).toHaveText('Submit');
});
```

## Debugging Tips

### 1. Use Playwright UI Mode

```bash
pnpm --filter=@rafters/ui test:component --ui
```

- Visual test runner with time-travel debugging
- See component render in real browser
- Inspect DOM and styles live

### 2. Use Debug Mode

```bash
pnpm --filter=@rafters/ui test:component --debug
```

- Steps through test line by line
- Pause execution at any point
- Inspect component state at each step

### 3. Take Screenshots on Failure

```typescript
test('should work correctly', async ({ mount }, testInfo) => {
  const component = await mount(<Button>Test</Button>);

  try {
    await expect(component).toHaveText('Expected Text');
  } catch (error) {
    // Capture screenshot on failure
    await testInfo.attach('failure', {
      body: await component.screenshot(),
      contentType: 'image/png'
    });
    throw error;
  }
});
```

### 4. Use test.step for Clear Reports

```typescript
test('complex workflow', async ({ mount }) => {
  await test.step('Mount component', async () => {
    const component = await mount(<Button>Test</Button>);
    await expect(component).toBeVisible();
  });

  await test.step('Interact with component', async () => {
    const component = page.locator('r-button');
    await component.click();
  });

  await test.step('Verify outcome', async () => {
    // Assertions
  });
});
```

### 5. Console Logs for Debugging

```typescript
test('debug test', async ({ mount, page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  const component = await mount(<Button>Debug</Button>);

  // Evaluate and log component state
  const state = await component.evaluate(el => ({
    disabled: el.hasAttribute('disabled'),
    className: el.className
  }));

  console.log('Component state:', state);
});
```

## Anti-Patterns to Avoid

### 1. Don't Test Implementation Details

```typescript
// BAD: Testing internal state directly
test('should have _focused property', async ({ mount }) => {
  const component = await mount(<r-button>Focus</r-button>);
  const focused = await component.evaluate(el => el._focused);
  expect(focused).toBe(false);
});

// GOOD: Test user-facing behavior
test('should respond to focus', async ({ mount }) => {
  const component = await mount(<r-button>Focus</r-button>);
  await component.focus();
  await expect(component).toBeFocused();
});
```

### 2. Don't Use force: true Unless Necessary

```typescript
// BAD: Forcing interactions that should fail
test('should click disabled button', async ({ mount }) => {
  const component = await mount(<Button disabled>Disabled</Button>);
  await component.click({ force: true }); // Bypasses disabled check
});

// GOOD: Test that disabled buttons can't be clicked
test('should not click when disabled', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button disabled onClick={() => { clicked = true; }}>
      Disabled
    </Button>
  );

  // Try to click (will fail naturally)
  await expect(component).toHaveAttribute('disabled');
  expect(clicked).toBe(false);
});
```

### 3. Don't Over-Use waitFor

```typescript
// BAD: Manual waiting
test('should render', async ({ mount, page }) => {
  await mount(<Button>Test</Button>);
  await page.waitForTimeout(1000); // Arbitrary wait
});

// GOOD: Use Playwright's auto-waiting
test('should render', async ({ mount }) => {
  const component = await mount(<Button>Test</Button>);
  await expect(component).toBeVisible(); // Auto-waits
});
```

### 4. Don't Test Third-Party Libraries

```typescript
// BAD: Testing that Tailwind classes work
test('should apply correct colors', async ({ mount }) => {
  const component = await mount(<Button variant="primary">Primary</Button>);
  const bgColor = await component.evaluate(el =>
    window.getComputedStyle(el).backgroundColor
  );
  expect(bgColor).toBe('rgb(0, 0, 0)');
});

// GOOD: Test that correct classes are applied
test('should have primary variant classes', async ({ mount }) => {
  const component = await mount(<Button variant="primary">Primary</Button>);
  const className = await component.getAttribute('class');
  expect(className).toContain('bg-primary');
});
```

### 5. Don't Make Tests Depend on Each Other

```typescript
// BAD: Tests that depend on execution order
let sharedState = 0;

test('first test', async ({ mount }) => {
  sharedState = 1;
});

test('second test', async ({ mount }) => {
  expect(sharedState).toBe(1); // Breaks if run in isolation
});

// GOOD: Each test is independent
test('should handle state independently', async ({ mount }) => {
  let localState = 0;
  const component = await mount(
    <Button onClick={() => { localState++; }}>Test</Button>
  );
  await component.click();
  expect(localState).toBe(1);
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Component Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v3
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm --filter=@rafters/ui test:component
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: packages/ui/test-results/
```

## Summary

### Testing Checklist for New Components

- [ ] Keyboard interactions (Enter, Space, arrows, Escape, Tab)
- [ ] Focus management (focus, blur, tabindex)
- [ ] ARIA attributes (role, aria-label, aria-disabled, etc.)
- [ ] Disabled state behavior
- [ ] All variants render correctly
- [ ] All sizes render correctly
- [ ] Loading state (if applicable)
- [ ] Event handlers (onClick, onChange, etc.)
- [ ] Props forwarding (className, data-*, id, etc.)
- [ ] Accessibility (accessible name, keyboard navigation)
- [ ] Visual states (hover, focus, active, disabled)
- [ ] Error states and edge cases
- [ ] Visual regression snapshots

### Key Principles

1. **Test user behavior, not implementation**
2. **Use Playwright's auto-waiting features**
3. **Test both primitive and wrapper layers**
4. **Write descriptive test names**
5. **Keep tests independent and isolated**
6. **Use meaningful assertions and error messages**
7. **Avoid testing third-party libraries**
8. **Leverage Playwright's debugging tools**

### Resources

- [Playwright Component Testing Docs](https://playwright.dev/docs/test-components)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
