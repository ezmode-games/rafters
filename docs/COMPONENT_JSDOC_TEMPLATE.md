# Component JSDoc Template for AI Intelligence

Use this template to add comprehensive design intelligence to component JSDoc comments:

```tsx
/**
 * [Component description - what it does for users]
 *
 * @registry-name [component-name]
 * @registry-version 0.1.0  
 * @registry-status published | draft | deprecated
 * @registry-path components/ui/ComponentName.tsx
 * @registry-type registry:component
 *
 * @cognitive-load [1-10]/10 - [Brief description of mental effort required]
 * @attention-economics [How component fits in visual hierarchy and attention management]
 * @trust-building [User confidence patterns, confirmation requirements, safety measures]
 * @accessibility [WCAG compliance level, screen reader support, keyboard navigation]
 * @semantic-meaning [Variant meanings and contextual usage rules]
 *
 * @usage-patterns
 * DO: [Primary use case with clear guidelines]
 * DO: [Secondary use case]  
 * NEVER: [Critical anti-patterns to avoid]
 *
 * @design-guides
 * - [Primary Pattern]: https://rafters.realhandy.tech/docs/llm/[pattern-name]
 * - [Secondary Pattern]: https://rafters.realhandy.tech/docs/llm/[pattern-name]
 *
 * @dependencies [Required packages like @radix-ui/react-slot]
 *
 * @example
 * ```tsx
 * // [Primary usage example with semantic context]
 * <ComponentName variant="primary">[Example Usage]</ComponentName>
 *
 * // [Secondary example showing different context]  
 * <ComponentName variant="destructive">[Destructive Action]</ComponentName>
 * ```
 */
```

## Examples by Component Type:

### Action Components (Button, Link):
```tsx
/**
 * Interactive button component for user actions
 *
 * @registry-name button
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Button.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
 * @attention-economics Size hierarchy: sm=tertiary, md=secondary, lg=primary. Primary variant commands highest attention - use sparingly (maximum 1 per section)
 * @trust-building Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
 * @accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
 * @semantic-meaning Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns
 *
 * @usage-patterns
 * DO: Primary buttons for main user goal, maximum 1 per section
 * DO: Secondary buttons for alternative paths, supporting actions
 * DO: Destructive variant for permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 *
 * @dependencies @radix-ui/react-slot
 *
 * @example
 * ```tsx
 * // Primary action - highest attention, use once per section
 * <Button variant="primary">Save Changes</Button>
 *
 * // Destructive action - requires confirmation UX
 * <Button variant="destructive" destructiveConfirm>Delete Account</Button>
 * ```
 */
```

### Form Components (Input, Select):
```tsx
/**
 * Text input component for data collection
 *
 * @registry-name input
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Input.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Simple data entry with clear expectations
 * @attention-economics Secondary priority - should not compete with primary actions
 * @trust-building Immediate validation feedback builds user confidence. Clear error states prevent confusion
 * @accessibility WCAG AAA compliant with proper labeling, keyboard navigation, and screen reader support
 * @semantic-meaning Variants indicate data type and validation requirements
 *
 * @usage-patterns
 * DO: Always pair with descriptive labels
 * DO: Provide helpful placeholder examples showing expected format
 * DO: Immediate validation feedback for user confidence
 * NEVER: Label-less inputs or validation only on submit
 *
 * @design-guides
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 *
 * @dependencies None
 *
 * @example
 * ```tsx
 * // Standard text input with proper labeling
 * <Input type="email" placeholder="user@example.com" />
 *
 * // Error state with validation feedback
 * <Input type="email" error="Please enter a valid email address" />
 * ```
 */
```

### Layout Components (Card, Container):
```tsx
/**
 * Content container component for grouping related information
 *
 * @registry-name card
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Card.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 1/10 - Invisible structure that reduces cognitive complexity
 * @attention-economics Creates content boundaries and visual breathing room, helps users scan and process information
 * @trust-building Consistent grouping patterns build familiarity and reduce user confusion
 * @accessibility Proper semantic structure with headings and landmarks for screen readers
 * @semantic-meaning Variants indicate content importance and relationship hierarchy
 *
 * @usage-patterns
 * DO: Group related information together
 * DO: Use different card styles to indicate content hierarchy
 * DO: Create scannable layouts with clear content boundaries
 * NEVER: Single items that don't benefit from grouping, excessive nesting
 *
 * @design-guides
 * - Negative Space: https://rafters.realhandy.tech/docs/llm/negative-space
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 *
 * @dependencies None
 *
 * @example
 * ```tsx
 * // Basic content grouping
 * <Card>
 *   <CardHeader><CardTitle>User Profile</CardTitle></CardHeader>
 *   <CardContent>Profile information...</CardContent>
 * </Card>
 * ```
 */
```

## Registry Annotation Reference:

### Required Annotations:
- `@registry-name` - Component identifier for registry system
- `@registry-version` - Semantic version for component tracking
- `@registry-status` - published | draft | deprecated
- `@registry-path` - File path for component location
- `@registry-type` - Always `registry:component` for components

### Intelligence Annotations:
- `@cognitive-load` - Mental effort rating (1-10 scale) with description
- `@attention-economics` - Visual hierarchy and attention management rules
- `@trust-building` - User confidence patterns and safety requirements
- `@accessibility` - WCAG compliance level and screen reader support
- `@semantic-meaning` - Variant purposes and contextual usage rules

### Documentation Annotations:
- `@usage-patterns` - DO/NEVER guidelines for proper usage
- `@design-guides` - Links to relevant design intelligence documentation
- `@dependencies` - Required external packages
- `@example` - Code examples with contextual commentary

### Component Registry Access:
These annotations enable AI agents to access design intelligence through:
- **Component Registry** - JSDoc intelligence for design reasoning (WHAT & WHY)
- **Token Registry** - Implementation values and relationships (HOW)  
- **MCP Integration** - AI agent access to embedded intelligence