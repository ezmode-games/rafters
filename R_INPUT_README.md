# r-input Primitive Implementation

## Overview
Successfully implemented the `r-input` primitive - a headless text input Web Component with validation states and WCAG AAA accessibility support.

## Implementation Details

### Core Component
**File:** `packages/ui/src/primitives/input/r-input.ts`

A Lit-based Web Component that:
- Extends `RPrimitiveBase` for consistent primitive behavior
- Supports multiple input types (text, email, password, search, tel, url, number)
- Implements validation on blur (not on keystroke for better UX)
- Provides ARIA support (textbox role, aria-invalid, aria-errormessage)
- Dispatches custom events (r-input, r-change, r-blur)
- Exposes native input via CSS part for styling

### Testing
**File:** `packages/ui/test/primitives/r-input.test.ts`

Comprehensive test suite with 36 tests covering:
- Rendering and structure
- All properties and attributes
- Event dispatching with proper detail
- Validation logic (required, pattern)
- Public methods (focus, blur, select)
- Accessibility features
- Base class integration
- Live directive behavior

### Type Declarations
**File:** `packages/ui/src/types/custom-elements.d.ts`

Added TypeScript declarations for JSX usage with all properties typed.

## Test Results
```
✓ test/primitives/r-input.test.ts (36 tests) 79ms
✓ test/primitives/r-button.test.ts (38 tests) 60ms
✓ test/setup.test.ts (9 tests) 27ms
✓ test/utils.test.ts (6 tests) 11ms

Test Files: 4 passed (4)
Tests: 89 passed (89)
```

## Quality Checks
- ✅ Biome linting: No issues
- ✅ TypeScript compilation: No errors
- ✅ All pre-commit hooks: Passed

## Usage Example

```typescript
// Import the component
import '@rafters/ui/primitives/input/r-input';

// Use in HTML
<r-input 
  type="email" 
  required 
  placeholder="user@example.com"
  aria-label="Email address"
></r-input>

// Listen to events
const input = document.querySelector('r-input');
input.addEventListener('r-input', (e) => {
  console.log('Value:', e.detail.value.value);
  console.log('Valid:', e.detail.value.isValid);
});
```

### Styling with CSS Parts
```css
r-input::part(input) {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

r-input[validation-state="error"]::part(input) {
  border-color: red;
}

r-input[validation-state="valid"]::part(input) {
  border-color: green;
}
```

## Key Features

### Input Types
- text (default)
- email
- password
- search
- tel
- url
- number

### Validation
- Required field validation
- Pattern matching with RegExp
- Validation triggered on blur (better UX than keystroke validation)
- Visual feedback via `validationState` property
- Error messages via `errorMessage` property

### Accessibility (WCAG AAA)
- Textbox role automatically set
- `aria-invalid` reflects validation state
- `aria-errormessage` shows error text
- Inherits `aria-label`, `aria-labelledby`, `aria-describedby` from base
- Supports disabled and readonly states

### Events
All events include timestamp and proper detail structure:
- `r-input`: Fires on input with value and validity
- `r-change`: Fires on change with value and validity
- `r-blur`: Fires on blur with value

### Properties
- `type`: Input type
- `value`: Current value
- `placeholder`: Placeholder text
- `required`: Required field
- `readonly`: Read-only mode
- `disabled`: Disabled state
- `minlength`: Minimum length
- `maxlength`: Maximum length
- `pattern`: Validation pattern (RegExp string)
- `autocomplete`: Autocomplete hint
- `name`: Form field name
- `validationState`: Current validation state ('valid' | 'error' | 'warning')
- `errorMessage`: Error message text

### Methods
- `focus()`: Focus the input
- `blur()`: Blur the input
- `select()`: Select the input text

## Design Decisions

1. **Validate on blur, not on input**: Prevents cognitive overload from real-time validation. Users can type freely without anxiety.

2. **Use native input with CSS parts**: Maximum browser compatibility and form integration. CSS parts allow full styling without Shadow DOM piercing issues.

3. **Headless by default**: No built-in styling allows full customization while maintaining functionality and accessibility.

4. **Event detail structure**: Consistent with base class pattern, includes timestamp for React 19 purity.

## Notes

The issue specification mentioned additional infrastructure that doesn't exist in the current repository:
- Registry system (`r-input.registry.ts`, `validate:registry` command)
- Accessibility test infrastructure (`test:a11y` command)
- Primitives index exports (`primitives/index.ts`)

These appear to be planned future additions to the design system infrastructure.
