# Rafters Form Patterns

## Field + Input Composition

Field is a wrapper that auto-wires accessibility between label, input, and messages.

```tsx
import { Field } from '@rafters/ui/components/ui/field';
import { Input } from '@rafters/ui/components/ui/input';

// Basic field
<Field label="Email" description="We'll never share your email">
  <Input type="email" placeholder="you@example.com" />
</Field>

// Required field
<Field label="Username" required>
  <Input />
</Field>

// Error state
<Field label="Password" error="Must be at least 8 characters">
  <Input type="password" />
</Field>
```

## How Field Works

Field uses `React.cloneElement` to inject accessibility props into children:

```tsx
// Field automatically adds to child Input:
// - id (generated or custom)
// - aria-describedby (links to description/error)
// - aria-invalid (when error present)
// - aria-required (when required)
// - disabled (inherited from Field)
```

## Input Variants

Input supports semantic variants for validation states:

| Variant | Use Case |
|---------|----------|
| default | Normal input state |
| destructive | Validation error |
| success | Validation passed |
| warning | Caution/attention |
| info | Informational |

```tsx
<Input variant="destructive" />  // Red border
<Input variant="success" />      // Green border
```

## Input Sizes

```tsx
<Input size="sm" />      // h-8, text-xs
<Input size="default" /> // h-10, text-sm
<Input size="lg" />      // h-12, text-base
```

## Card + Field Composition

For token editors, combine Card structure with Field:

```tsx
<Card>
  <CardHeader>
    <CardTitle as="h4">token-name</CardTitle>
    <CardDescription>Token description</CardDescription>
  </CardHeader>
  <CardContent>
    <Field label="Value" description="Format hint">
      <Input placeholder="example" />
    </Field>
  </CardContent>
</Card>
```

## Key Principles

1. **Field handles accessibility** - Never manually wire htmlFor/aria-describedby
2. **Input is pure** - Just renders, Field adds context
3. **Variants are semantic** - destructive = error, success = valid
4. **Placeholder shows format** - Use for examples, not labels
5. **Description before error** - Error replaces description when present
