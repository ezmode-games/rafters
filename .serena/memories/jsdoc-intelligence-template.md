# JSDoc Intelligence Template for Rafters Components

This template is extracted from `remotes/origin/feature/registry-jsdoc-metadata` branch.

## Template Structure

```tsx
/**
 * [Component description - what it does, primary purpose]
 *
 * ## Registry Metadata
 * @registry-name [component-name-lowercase]
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/[ComponentName].tsx
 * @registry-type registry:component
 *
 * ## Intelligence Metadata
 * @cognitive-load X/10 - [Brief explanation of cognitive overhead]
 * @attention-economics [Size/variant hierarchy and attention patterns]
 * @trust-building [Trust patterns, confirmation requirements, feedback mechanisms]
 * @accessibility [WCAG compliance, touch targets, contrast, screen reader notes]
 * @semantic-meaning [Variant/role semantic mappings]
 *
 * ## Usage Patterns
 * @usage-patterns
 * DO: [Best practice 1]
 * DO: [Best practice 2]
 * DO: [Best practice 3]
 * NEVER: [Anti-pattern to avoid]
 *
 * ## Design Guides
 * @design-guides
 * - [Guide Name]: https://rafters.realhandy.tech/docs/llm/[guide-slug]
 *
 * ## Dependencies
 * @dependencies [list of package dependencies]
 *
 * ## Example
 * @example
 * ```tsx
 * // Example with comments explaining the pattern
 * <Component prop="value">Content</Component>
 * ```
 */
```

## Cognitive Load Scale (0-10)

| Score | Description | Example Components |
|-------|-------------|-------------------|
| 0-2 | Minimal overhead, passive display | Badge, Avatar |
| 3-4 | Simple interaction, clear purpose | Button, Input |
| 5-6 | Moderate decision-making | Dialog, Select |
| 7-8 | Complex interaction patterns | Form, DataTable |
| 9-10 | Significant cognitive investment | Multi-step Wizard |

## Attention Economics Patterns

- **Size hierarchy**: sm=tertiary, md=secondary, lg=primary
- **Variant hierarchy**: primary=main actions, secondary=supporting, destructive=safety patterns
- **Primary button rule**: Maximum 1 per section
- **Elevation hierarchy**: Interactive states use elevation for affordance

## Trust Building Patterns

- **Low trust**: Quick confirmations, minimal friction
- **Medium trust**: Clear context, moderate consequences
- **High trust**: Detailed explanation, significant impact
- **Critical trust**: Progressive confirmation, permanent actions

## Example from Button.tsx

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
 * @attention-economics Size hierarchy: sm=tertiary actions, md=secondary interactions, lg=primary calls-to-action. Primary variant commands highest attention - use sparingly (maximum 1 per section)
 * @trust-building Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
 * @accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
 * @semantic-meaning Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns
 *
 * @usage-patterns
 * DO: Primary: Main user goal, maximum 1 per section
 * DO: Secondary: Alternative paths, supporting actions
 * DO: Destructive: Permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Component Patterns: https://rafters.realhandy.tech/docs/llm/component-patterns
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
 *
 * // Loading state - prevents double submission
 * <Button loading>Processing...</Button>
 * ```
 */
```

## Example from Dialog.tsx

```tsx
/**
 * Modal dialog component with focus management and escape patterns
 *
 * @registry-name dialog
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Dialog.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 6/10 - Interrupts user flow, requires decision making
 * @attention-economics Attention capture: modal=full attention, drawer=partial attention, popover=contextual attention
 * @trust-building Clear close mechanisms, confirmation for destructive actions, non-blocking for informational content
 * @accessibility Focus trapping, escape key handling, backdrop dismissal, screen reader announcements
 * @semantic-meaning Usage patterns: modal=blocking workflow, drawer=supplementary, alert=urgent information
 *
 * @usage-patterns
 * DO: Low trust - Quick confirmations, save draft (size=sm, minimal friction)
 * DO: Medium trust - Publish content, moderate consequences (clear context)
 * DO: High trust - Payments, significant impact (detailed explanation)
 * DO: Critical trust - Account deletion, permanent loss (progressive confirmation)
 * NEVER: Routine actions, non-essential interruptions
 *
 * @design-guides
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-dialog, @rafters/design-tokens/motion
 *
 * @example
 * ```tsx
 * // Critical trust dialog with confirmation
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="destructive">Delete Account</Button>
 *   </DialogTrigger>
 *   <DialogContent trustLevel="critical" destructive>
 *     <DialogTitle>Delete Account</DialogTitle>
 *     <DialogDescription>This action cannot be undone.</DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
```

## Example from Card.tsx

```tsx
/**
 * Flexible container component for grouping related content with semantic structure
 *
 * @registry-name card
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Card.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Simple container with clear boundaries and minimal cognitive overhead
 * @attention-economics Neutral container: Content drives attention, elevation hierarchy for interactive states
 * @trust-building Consistent spacing, predictable interaction patterns, clear content boundaries
 * @accessibility Proper heading structure, landmark roles, keyboard navigation for interactive cards
 * @semantic-meaning Structural roles: article=standalone content, section=grouped content, aside=supplementary information
 *
 * @usage-patterns
 * DO: Group related information with clear visual boundaries
 * DO: Create interactive cards with hover states and focus management
 * DO: Establish information hierarchy with header, content, actions
 * DO: Implement responsive scaling with consistent proportions
 * NEVER: Use decorative containers without semantic purpose
 *
 * @design-guides
 * - Content Grouping: https://rafters.realhandy.tech/docs/llm/content-grouping
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Spatial Relationships: https://rafters.realhandy.tech/docs/llm/spatial-relationships
 *
 * @dependencies @rafters/design-tokens/motion
 *
 * @example
 * ```tsx
 * // Basic card with content structure
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Supporting description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Main card content
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
```
