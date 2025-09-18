# Component JSDoc Template for AI Intelligence

Use this template to add comprehensive design intelligence to component JSDoc comments:

```tsx
/**
 * [Component description - what it does for users]
 *
 * @registryName [component-name]
 * @registryVersion 0.1.0
 * @registryStatus published | draft | deprecated
 * @registryPath components/ui/ComponentName.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad [1-10]/10 - [Brief description of mental effort required]
 * @attentionEconomics [How component fits in visual hierarchy and attention management]
 * @trustBuilding [User confidence patterns, confirmation requirements, safety measures]
 * @accessibility [WCAG compliance level, screen reader support, keyboard navigation]
 * @semanticMeaning [Variant meanings and contextual usage rules]
 *
 * @usagePatterns
 * DO: [Primary use case with clear guidelines]
 * DO: [Secondary use case]
 * NEVER: [Critical anti-patterns to avoid]
 *
 * @designGuides
 * - [Primary Pattern]: https://rafters.realhandy.tech/docs/foundation/[pattern-name]
 * - [Secondary Pattern]: https://rafters.realhandy.tech/docs/components/[component-name]
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
 * @registryName button
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Button.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 3/10 - Simple action trigger with clear visual hierarchy
 * @attentionEconomics Size hierarchy: sm=tertiary, md=secondary, lg=primary. Primary variant commands highest attention - use sparingly (maximum 1 per section)
 * @trustBuilding Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
 * @accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
 * @semanticMeaning Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns
 *
 * @usagePatterns
 * DO: Primary buttons for main user goal, maximum 1 per section
 * DO: Secondary buttons for alternative paths, supporting actions
 * DO: Destructive variant for permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 *
 * @designGuides
 * - Attention Economics: https://rafters.realhandy.tech/docs/foundation/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/foundation/trust-building
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
 * @registryName input
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Input.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 2/10 - Simple data entry with clear expectations
 * @attentionEconomics Secondary priority - should not compete with primary actions
 * @trustBuilding Immediate validation feedback builds user confidence. Clear error states prevent confusion
 * @accessibility WCAG AAA compliant with proper labeling, keyboard navigation, and screen reader support
 * @semanticMeaning Variants indicate data type and validation requirements
 *
 * @usagePatterns
 * DO: Always pair with descriptive labels
 * DO: Provide helpful placeholder examples showing expected format
 * DO: Immediate validation feedback for user confidence
 * NEVER: Label-less inputs or validation only on submit
 *
 * @designGuides
 * - Trust Building: https://rafters.realhandy.tech/docs/foundation/trust-building
 * - Cognitive Load: https://rafters.realhandy.tech/docs/foundation/cognitive-load
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
 * @registryName card
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Card.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 1/10 - Invisible structure that reduces cognitive complexity
 * @attentionEconomics Creates content boundaries and visual breathing room, helps users scan and process information
 * @trustBuilding Consistent grouping patterns build familiarity and reduce user confusion
 * @accessibility Proper semantic structure with headings and landmarks for screen readers
 * @semanticMeaning Variants indicate content importance and relationship hierarchy
 *
 * @usagePatterns
 * DO: Group related information together
 * DO: Use different card styles to indicate content hierarchy
 * DO: Create scannable layouts with clear content boundaries
 * NEVER: Single items that don't benefit from grouping, excessive nesting
 *
 * @designGuides
 * - Negative Space: https://rafters.realhandy.tech/docs/foundation/negative-space
 * - Attention Economics: https://rafters.realhandy.tech/docs/foundation/attention-economics
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
- `@registryName` - Component identifier for registry system
- `@registryVersion` - Semantic version for component tracking
- `@registryStatus` - published | draft | deprecated
- `@registryPath` - File path for component location
- `@registryType` - Always `registry:component` for components

### Intelligence Annotations:
- `@cognitiveLoad` - Mental effort rating (1-10 scale) with description
- `@attentionEconomics` - Visual hierarchy and attention management rules
- `@trustBuilding` - User confidence patterns and safety requirements
- `@accessibility` - WCAG compliance level and screen reader support
- `@semanticMeaning` - Variant purposes and contextual usage rules

### Documentation Annotations:
- `@usagePatterns` - DO/NEVER guidelines for proper usage
- `@designGuides` - Links to relevant design intelligence documentation
- `@dependencies` - Required external packages
- `@example` - Code examples with contextual commentary

### Component Registry Access:
These annotations enable AI agents to access design intelligence through:
- **Component Registry** - JSDoc intelligence for design reasoning (WHAT & WHY)
- **Token Registry** - Implementation values and relationships (HOW)
- **MCP Integration** - AI agent access to embedded intelligence
- **AI Documentation** - https://rafters.realhandy.tech/llms.txt
- **Human Documentation** - https://rafters.realhandy.tech/docs/**