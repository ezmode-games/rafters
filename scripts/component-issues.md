# Component Implementation Issues for Agent Execution

This document contains GitHub issue templates for simple shadcn-compatible components.
All components use the same pattern: vanilla TS primitives + React wrapper + Tailwind v4 tokens.

**Accessibility Standard:** Section 508 / WCAG 2.2 AA compliance

---

## Test Structure (REQUIRED FOR ALL COMPONENTS)

Each component requires **three test files**:

1. **Unit Tests** (`test/components/<name>.test.tsx`)
   - Pure logic testing with Vitest + React Testing Library
   - Props, variants, sizes, ref forwarding
   - Event handlers

2. **Component Tests** (`test/components/<name>.component.tsx`)
   - Playwright Component Testing
   - Real browser interactions
   - Visual behavior verification

3. **Accessibility Tests** (`test/components/<name>.a11y.tsx`)
   - Playwright + axe-core
   - WCAG 2.2 AA compliance (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`)
   - Section 508 compliance
   - Keyboard navigation verification
   - Screen reader compatibility

---

## Reference Files

Before implementing any component, read these:

```
packages/ui/src/components/ui/button.tsx          # Component pattern
packages/ui/src/primitives/classy.ts              # Class merging
packages/ui/test/components/button.test.tsx       # Unit test pattern
packages/ui/test/components/dialog.test.tsx       # Component test pattern
test/infrastructure/accessibility.a11y.tsx        # A11y test pattern with axe-core
```

---

## Token Classes Reference

Use ONLY these semantic token classes (no arbitrary Tailwind values):

### Colors
- `bg-primary`, `text-primary-foreground`, `border-primary`
- `bg-secondary`, `text-secondary-foreground`, `border-secondary`
- `bg-destructive`, `text-destructive-foreground`, `border-destructive`
- `bg-success`, `text-success-foreground`, `border-success`
- `bg-warning`, `text-warning-foreground`, `border-warning`
- `bg-muted`, `text-muted-foreground`
- `bg-card`, `text-card-foreground`
- `bg-background`, `text-foreground`
- `border-border`, `border-input`
- `ring-ring`

### Opacity Variants (for backgrounds)
- `bg-destructive/10`, `bg-success/10`, `bg-warning/10`

---

## TIER 1: Pure Styling Components (No Primitives)

---

### Issue: Implement Badge Component

**Title:** `feat(ui): implement Badge component with Section 508 compliance`

**Labels:** `component`, `tier-1`, `good-first-issue`, `agent-ready`, `a11y`

**Body:**

```markdown
## Summary

Implement the Badge component - a simple inline label/tag for status indicators.
Must be Section 508 / WCAG 2.2 AA compliant.

## Files to Create

1. `packages/ui/src/components/ui/badge.tsx`
2. `packages/ui/test/components/badge.test.tsx` (unit tests)
3. `packages/ui/test/components/badge.component.tsx` (component tests)
4. `packages/ui/test/components/badge.a11y.tsx` (accessibility tests)

## Reference Files (READ FIRST)

- `packages/ui/src/components/ui/button.tsx`
- `packages/ui/src/primitives/classy.ts`
- `test/infrastructure/accessibility.a11y.tsx`

## Implementation

### badge.tsx

```tsx
import * as React from 'react';
import classy from '../../primitives/classy';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border border-border bg-transparent text-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={classy(
          'inline-flex items-center rounded-full font-medium',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
export default Badge;
```

### badge.test.tsx (Unit Tests)

```tsx
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import Badge from '../../src/components/ui/badge';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText('Error').className).toContain('bg-destructive');

    rerender(<Badge variant="success">Done</Badge>);
    expect(screen.getByText('Done').className).toContain('bg-success');

    rerender(<Badge variant="warning">Warn</Badge>);
    expect(screen.getByText('Warn').className).toContain('bg-warning');

    rerender(<Badge variant="outline">Out</Badge>);
    expect(screen.getByText('Out').className).toContain('border');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small').className).toContain('text-xs');

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large').className).toContain('text-base');
  });

  it('merges custom className', () => {
    render(<Badge className="custom-class">Test</Badge>);
    expect(screen.getByText('Test').className).toContain('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('passes through additional props', () => {
    render(<Badge data-testid="badge" id="my-badge">Props</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('id', 'my-badge');
  });
});
```

### badge.component.tsx (Component Tests)

```tsx
import { expect, test } from '@playwright/experimental-ct-react';
import Badge from '../../src/components/ui/badge';

test.describe('Badge Component', () => {
  test('renders all variants correctly', async ({ mount }) => {
    const component = await mount(
      <div>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    );

    await expect(component.getByText('Default')).toBeVisible();
    await expect(component.getByText('Secondary')).toBeVisible();
    await expect(component.getByText('Destructive')).toBeVisible();
    await expect(component.getByText('Success')).toBeVisible();
    await expect(component.getByText('Warning')).toBeVisible();
    await expect(component.getByText('Outline')).toBeVisible();
  });

  test('renders all sizes correctly', async ({ mount }) => {
    const component = await mount(
      <div>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    );

    await expect(component.getByText('Small')).toBeVisible();
    await expect(component.getByText('Medium')).toBeVisible();
    await expect(component.getByText('Large')).toBeVisible();
  });
});
```

### badge.a11y.tsx (Accessibility Tests)

```tsx
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Badge Accessibility @a11y', () => {
  test('meets WCAG 2.2 AA standards', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Badge Test</title></head>
        <body>
          <span class="inline-flex items-center rounded-full font-medium px-2.5 py-0.5 text-sm"
                style="background: #3b82f6; color: white;">
            New
          </span>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('all variants meet color contrast requirements', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Badge Contrast Test</title></head>
        <body>
          <span style="background: #3b82f6; color: white; padding: 4px 10px;">Default</span>
          <span style="background: #ef4444; color: white; padding: 4px 10px;">Destructive</span>
          <span style="background: #22c55e; color: white; padding: 4px 10px;">Success</span>
          <span style="background: #f59e0b; color: black; padding: 4px 10px;">Warning</span>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('is readable by screen readers', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Badge SR Test</title></head>
        <body>
          <p>Status: <span>Active</span></p>
        </body>
      </html>
    `);

    const badge = page.getByText('Active');
    await expect(badge).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

## Acceptance Criteria

- [ ] Component renders with all 6 variants
- [ ] Component renders with all 3 sizes
- [ ] Custom className merges correctly
- [ ] Ref forwarding works
- [ ] Unit tests pass: `pnpm test --filter @rafters/ui -- badge`
- [ ] Component tests pass: `pnpm exec playwright test --grep badge`
- [ ] A11y tests pass: `pnpm exec playwright test --grep "Badge Accessibility"`
- [ ] TypeScript compiles: `pnpm run typecheck`
- [ ] Lint passes: `pnpm exec biome check packages/ui`
- [ ] All color variants meet WCAG 2.2 AA contrast (4.5:1 for text)

## Section 508 Requirements

- Text must have 4.5:1 contrast ratio against background
- Component must not rely solely on color to convey meaning
- Content must be readable by screen readers
```

---

### Issue: Implement Separator Component

**Title:** `feat(ui): implement Separator component with Section 508 compliance`

**Labels:** `component`, `tier-1`, `good-first-issue`, `agent-ready`, `a11y`

**Body:**

```markdown
## Summary

Implement the Separator component - a visual divider between content sections.
Must be Section 508 / WCAG 2.2 AA compliant with proper ARIA roles.

## Files to Create

1. `packages/ui/src/components/ui/separator.tsx`
2. `packages/ui/test/components/separator.test.tsx`
3. `packages/ui/test/components/separator.component.tsx`
4. `packages/ui/test/components/separator.a11y.tsx`

## Implementation

### separator.tsx

```tsx
import * as React from 'react';
import classy from '../../primitives/classy';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    const isHorizontal = orientation === 'horizontal';

    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={classy(
          'shrink-0 bg-border',
          isHorizontal ? 'h-px w-full' : 'h-full w-px',
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';
export default Separator;
```

### separator.test.tsx (Unit Tests)

```tsx
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import Separator from '../../src/components/ui/separator';

describe('Separator', () => {
  it('renders horizontal by default', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep.className).toContain('h-px');
    expect(sep.className).toContain('w-full');
  });

  it('renders vertical orientation', () => {
    render(<Separator orientation="vertical" data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep.className).toContain('w-px');
    expect(sep.className).toContain('h-full');
  });

  it('is decorative by default (role=none)', () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveAttribute('role', 'none');
  });

  it('has separator role when not decorative', () => {
    render(<Separator decorative={false} data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveAttribute('role', 'separator');
    expect(sep).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('sets aria-orientation for vertical non-decorative', () => {
    render(<Separator decorative={false} orientation="vertical" data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
```

### separator.component.tsx (Component Tests)

```tsx
import { expect, test } from '@playwright/experimental-ct-react';
import Separator from '../../src/components/ui/separator';

test.describe('Separator Component', () => {
  test('horizontal separator is visible', async ({ mount }) => {
    const component = await mount(
      <div style={{ padding: '20px' }}>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>
    );

    await expect(component.getByText('Above')).toBeVisible();
    await expect(component.getByText('Below')).toBeVisible();
  });

  test('vertical separator in flex container', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', height: '100px', alignItems: 'center', gap: '10px' }}>
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    );

    await expect(component.getByText('Left')).toBeVisible();
    await expect(component.getByText('Right')).toBeVisible();
  });
});
```

### separator.a11y.tsx (Accessibility Tests)

```tsx
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Separator Accessibility @a11y', () => {
  test('decorative separator meets WCAG 2.2 AA', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Separator Test</title></head>
        <body>
          <p>Section 1</p>
          <div role="none" style="height: 1px; width: 100%; background: #e5e7eb;"></div>
          <p>Section 2</p>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('semantic separator has correct ARIA', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Separator ARIA Test</title></head>
        <body>
          <nav>
            <a href="#home">Home</a>
            <div role="separator" aria-orientation="vertical" style="width: 1px; height: 20px; background: #e5e7eb;"></div>
            <a href="#about">About</a>
          </nav>
        </body>
      </html>
    `);

    const separator = page.getByRole('separator');
    await expect(separator).toHaveAttribute('aria-orientation', 'vertical');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('separator does not interfere with keyboard navigation', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Separator Nav Test</title></head>
        <body>
          <button>Button 1</button>
          <div role="none" style="height: 1px; background: #e5e7eb;"></div>
          <button>Button 2</button>
        </body>
      </html>
    `);

    await page.keyboard.press('Tab');
    await expect(page.getByText('Button 1')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByText('Button 2')).toBeFocused();
  });
});
```

## Section 508 Requirements

- Decorative separators use `role="none"` to be ignored by AT
- Semantic separators use `role="separator"` with `aria-orientation`
- Must not create keyboard traps
- Sufficient color contrast against background
```

---

### Issue: Implement Skeleton Component

**Title:** `feat(ui): implement Skeleton component with Section 508 compliance`

**Labels:** `component`, `tier-1`, `good-first-issue`, `agent-ready`, `a11y`

**Body:**

```markdown
## Summary

Implement the Skeleton component - a loading placeholder with pulse animation.
Must respect `prefers-reduced-motion` for Section 508 compliance.

## Files to Create

1. `packages/ui/src/components/ui/skeleton.tsx`
2. `packages/ui/test/components/skeleton.test.tsx`
3. `packages/ui/test/components/skeleton.component.tsx`
4. `packages/ui/test/components/skeleton.a11y.tsx`

## Implementation

### skeleton.tsx

```tsx
import * as React from 'react';
import classy from '../../primitives/classy';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={classy(
          'rounded-md bg-muted',
          'motion-safe:animate-pulse motion-reduce:animate-none',
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
export default Skeleton;
```

### skeleton.test.tsx (Unit Tests)

```tsx
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import Skeleton from '../../src/components/ui/skeleton';

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has motion-safe animation class', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton').className).toContain('motion-safe:animate-pulse');
  });

  it('respects reduced motion preference', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton').className).toContain('motion-reduce:animate-none');
  });

  it('has muted background', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton').className).toContain('bg-muted');
  });

  it('merges custom className', () => {
    render(<Skeleton className="h-4 w-full" data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('h-4');
    expect(el.className).toContain('w-full');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
```

### skeleton.component.tsx (Component Tests)

```tsx
import { expect, test } from '@playwright/experimental-ct-react';
import Skeleton from '../../src/components/ui/skeleton';

test.describe('Skeleton Component', () => {
  test('renders with custom dimensions', async ({ mount }) => {
    const component = await mount(
      <Skeleton className="h-12 w-48" data-testid="skeleton" />
    );

    await expect(component).toBeVisible();
  });

  test('can be used for text placeholders', async ({ mount }) => {
    const component = await mount(
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );

    await expect(component).toBeVisible();
  });

  test('can be used for avatar placeholders', async ({ mount }) => {
    const component = await mount(
      <Skeleton className="h-12 w-12 rounded-full" />
    );

    await expect(component).toBeVisible();
  });
});
```

### skeleton.a11y.tsx (Accessibility Tests)

```tsx
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Skeleton Accessibility @a11y', () => {
  test('skeleton is hidden from screen readers', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Skeleton Test</title></head>
        <body>
          <div aria-hidden="true" class="h-4 w-full bg-gray-200 animate-pulse"></div>
        </body>
      </html>
    `);

    const skeleton = page.locator('[aria-hidden="true"]');
    await expect(skeleton).toHaveAttribute('aria-hidden', 'true');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Skeleton Motion Test</title>
          <style>
            @media (prefers-reduced-motion: reduce) {
              .skeleton { animation: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="skeleton" aria-hidden="true" style="width: 100px; height: 20px; background: #e5e7eb;"></div>
        </body>
      </html>
    `);

    const skeleton = page.locator('.skeleton');
    const animation = await skeleton.evaluate(el => getComputedStyle(el).animation);
    expect(animation).toContain('none');
  });

  test('loading state with live region', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Skeleton Loading Test</title></head>
        <body>
          <div aria-live="polite" aria-busy="true">
            <span class="sr-only">Loading content...</span>
            <div aria-hidden="true" class="h-4 w-full bg-gray-200"></div>
          </div>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

## Section 508 Requirements

- Must use `aria-hidden="true"` so screen readers ignore placeholder
- Animation must respect `prefers-reduced-motion` media query
- Parent container should use `aria-live` and `aria-busy` for loading states
- Consider providing screen reader text like "Loading content..."
```

---

### Issue: Implement Input Component

**Title:** `feat(ui): implement Input component with Section 508 compliance`

**Labels:** `component`, `tier-2`, `form`, `agent-ready`, `a11y`

**Body:**

```markdown
## Summary

Implement the Input component - a styled text input with proper ARIA support.
Must be Section 508 / WCAG 2.2 AA compliant.

## Files to Create

1. `packages/ui/src/components/ui/input.tsx`
2. `packages/ui/test/components/input.test.tsx`
3. `packages/ui/test/components/input.component.tsx`
4. `packages/ui/test/components/input.a11y.tsx`

## Implementation

### input.tsx

```tsx
import * as React from 'react';
import classy from '../../primitives/classy';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={classy(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
          'text-sm text-foreground',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
```

### input.test.tsx (Unit Tests)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import Input from '../../src/components/ui/input';

describe('Input', () => {
  it('renders with default type text', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'text');
  });

  it('accepts different types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
  });

  it('handles onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} placeholder="Type" />);

    await user.type(screen.getByPlaceholderText('Type'), 'hello');
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it('supports disabled state', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });

  it('supports required attribute', () => {
    render(<Input required placeholder="Required" />);
    expect(screen.getByPlaceholderText('Required')).toBeRequired();
  });

  it('supports aria-label', () => {
    render(<Input aria-label="Search input" />);
    expect(screen.getByLabelText('Search input')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
```

### input.component.tsx (Component Tests)

```tsx
import { expect, test } from '@playwright/experimental-ct-react';
import Input from '../../src/components/ui/input';

test.describe('Input Component', () => {
  test('accepts user input', async ({ mount }) => {
    const component = await mount(<Input placeholder="Type here" />);

    const input = component.getByPlaceholder('Type here');
    await input.fill('Hello World');

    await expect(input).toHaveValue('Hello World');
  });

  test('shows focus ring on focus', async ({ mount }) => {
    const component = await mount(<Input placeholder="Focus me" />);

    const input = component.getByPlaceholder('Focus me');
    await input.focus();

    await expect(input).toBeFocused();
  });

  test('disabled input cannot be edited', async ({ mount }) => {
    const component = await mount(<Input disabled placeholder="Disabled" />);

    const input = component.getByPlaceholder('Disabled');
    await expect(input).toBeDisabled();
  });
});
```

### input.a11y.tsx (Accessibility Tests)

```tsx
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Input Accessibility @a11y', () => {
  test('input with label meets WCAG 2.2 AA', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Input Test</title></head>
        <body>
          <label for="email">Email address</label>
          <input type="email" id="email" placeholder="you@example.com" />
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('input with aria-label meets WCAG', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Input ARIA Test</title></head>
        <body>
          <input type="search" aria-label="Search" placeholder="Search..." />
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('focus is visible (WCAG 2.4.7)', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Focus Test</title>
          <style>
            input:focus-visible {
              outline: 2px solid #3b82f6;
              outline-offset: 2px;
            }
          </style>
        </head>
        <body>
          <label for="test">Test</label>
          <input type="text" id="test" />
        </body>
      </html>
    `);

    const input = page.locator('input');
    await input.focus();
    await expect(input).toBeFocused();

    const outline = await input.evaluate(el => getComputedStyle(el).outline);
    expect(outline).not.toBe('none');
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Keyboard Test</title></head>
        <body>
          <input type="text" placeholder="First" />
          <input type="text" placeholder="Second" />
        </body>
      </html>
    `);

    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('First')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('Second')).toBeFocused();
  });
});
```

## Section 508 Requirements

- Must have accessible name (label, aria-label, or aria-labelledby)
- Must have visible focus indicator (2px minimum, 3:1 contrast)
- Placeholder text must not be sole label
- Error states must use `aria-invalid` and `aria-describedby`
```

---

## Commands for Agents

After implementing any component:

```bash
# Run unit tests
pnpm test --filter @rafters/ui -- <component-name>

# Run component tests
pnpm exec playwright test --project=component --grep <component-name>

# Run a11y tests
pnpm exec playwright test --grep "@a11y" --grep <component-name>

# Run all tests
pnpm test --filter @rafters/ui

# Type check
pnpm run typecheck

# Lint
pnpm exec biome check packages/ui
```

---

## Component Checklist

### Tier 1: Pure Styling (No Primitives)
- [ ] Badge
- [ ] Separator
- [ ] Skeleton
- [ ] Kbd
- [ ] Card (with subcomponents)
- [ ] Alert (with subcomponents)
- [ ] Avatar (with fallback)
- [ ] Progress

### Tier 2: Form Inputs (No Primitives)
- [ ] Input
- [ ] Textarea
- [ ] Label

---

## Section 508 / WCAG 2.2 AA Quick Reference

1. **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
2. **Focus Visible**: 2px focus indicator with 3:1 contrast
3. **Keyboard Accessible**: All interactive elements reachable via Tab
4. **Name, Role, Value**: Proper ARIA attributes for AT
5. **Error Identification**: Programmatic error states with descriptions
6. **Labels**: All inputs must have accessible names
7. **Motion**: Respect `prefers-reduced-motion`
