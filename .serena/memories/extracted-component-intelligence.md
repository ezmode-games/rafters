# Extracted Component Intelligence Data

Source: `remotes/origin/feature/registry-jsdoc-metadata` branch

This file contains the raw intelligence metadata extracted from all components in the old branch.
Use this data to restore annotations to current components.

---

## Badge

```
@cognitive-load 2/10 - Optimized for peripheral scanning with minimal cognitive overhead
@attention-economics Secondary/tertiary support: Maximum 1 high-attention badge per section, unlimited subtle badges
@trust-building Low trust informational display with optional interaction patterns
@accessibility Multi-sensory communication: Color + Icon + Text + Pattern prevents single-point accessibility failure
@semantic-meaning Status communication with semantic variants: success=completion, warning=caution, error=problems, info=neutral information

@usage-patterns
DO: Use for status indicators with multi-sensory communication
DO: Navigation badges for notification counts and sidebar status
DO: Category labels with semantic meaning over arbitrary colors
DO: Interactive badges with enhanced touch targets for removal/expansion
NEVER: Primary actions, complex information, critical alerts requiring immediate action
```

---

## Breadcrumb

```
@cognitive-load 2/10 - Optimized for peripheral navigation aid with minimal cognitive overhead
@attention-economics Tertiary support: Never competes with primary content, provides spatial context only
@trust-building Low trust routine navigation with predictable, reliable wayfinding patterns
@accessibility Complete ARIA support with aria-current="page", aria-hidden separators, and keyboard navigation
@semantic-meaning Wayfinding system with spatial context and navigation hierarchy indication

@usage-patterns
DO: Provide spatial context and navigation hierarchy
DO: Use clear current page indication with aria-current="page"
DO: Implement truncation strategies for long paths (Miller's Law)
DO: Configure separators with proper accessibility attributes
NEVER: Use for primary actions, complex information, or critical alerts
```

---

## Button

```
@cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
@attention-economics Size hierarchy: sm=tertiary actions, md=secondary interactions, lg=primary calls-to-action. Primary variant commands highest attention - use sparingly (maximum 1 per section)
@trust-building Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
@accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
@semantic-meaning Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns

@usage-patterns
DO: Primary: Main user goal, maximum 1 per section
DO: Secondary: Alternative paths, supporting actions
DO: Destructive: Permanent actions, requires confirmation patterns
NEVER: Multiple primary buttons competing for attention
```

---

## Card

```
@cognitive-load 2/10 - Simple container with clear boundaries and minimal cognitive overhead
@attention-economics Neutral container: Content drives attention, elevation hierarchy for interactive states
@trust-building Consistent spacing, predictable interaction patterns, clear content boundaries
@accessibility Proper heading structure, landmark roles, keyboard navigation for interactive cards
@semantic-meaning Structural roles: article=standalone content, section=grouped content, aside=supplementary information

@usage-patterns
DO: Group related information with clear visual boundaries
DO: Create interactive cards with hover states and focus management
DO: Establish information hierarchy with header, content, actions
DO: Implement responsive scaling with consistent proportions
NEVER: Use decorative containers without semantic purpose
```

---

## Chip

```
@cognitive-load 5/10 - High visibility overlay requiring immediate attention (varies by variant)
@attention-economics Secondary overlay with maximum visibility without overwhelming primary content
@trust-building Critical status and count information builds user awareness and system transparency
@accessibility High contrast indicators, screen reader announcements, keyboard navigation support
@semantic-meaning Status communication: count=quantity indication, status=state indication, badge=feature marking, dot=simple presence indicator

@usage-patterns
DO: Use for notification counts (unread messages, alerts, status updates)
DO: Provide status indicators (live, new, beta, premium features)
DO: Create urgent overlays that break component boundaries for maximum visibility
DO: Attach universally to buttons, cards, avatars, badges, any component
NEVER: Use for primary actions, complex information, or standalone content
```

---

## Container

```
@cognitive-load 0/10 - Invisible structure that reduces visual complexity
@attention-economics Neutral structural element: Controls content width and breathing room without competing for attention
@trust-building Predictable boundaries and consistent spacing patterns
@accessibility Semantic HTML elements with proper landmark roles for screen readers
@semantic-meaning Content width control and semantic structure: main=primary content, section=grouped content, article=standalone content

@usage-patterns
DO: Use padding prop for internal breathing room
DO: Control content boundaries with max-w-* classes
DO: Apply semantic structure with as="main|section|article"
DO: Maintain predictable component boundaries
NEVER: Use margins for content spacing (use padding instead)
NEVER: Unnecessarily nest containers or use fixed widths
```

---

## Dialog

```
@cognitive-load 6/10 - Interrupts user flow, requires decision making
@attention-economics Attention capture: modal=full attention, drawer=partial attention, popover=contextual attention
@trust-building Clear close mechanisms, confirmation for destructive actions, non-blocking for informational content
@accessibility Focus trapping, escape key handling, backdrop dismissal, screen reader announcements
@semantic-meaning Usage patterns: modal=blocking workflow, drawer=supplementary, alert=urgent information

@usage-patterns
DO: Low trust - Quick confirmations, save draft (size=sm, minimal friction)
DO: Medium trust - Publish content, moderate consequences (clear context)
DO: High trust - Payments, significant impact (detailed explanation)
DO: Critical trust - Account deletion, permanent loss (progressive confirmation)
NEVER: Routine actions, non-essential interruptions
```

---

## Grid

```
@cognitive-load 4/10 - Layout container with intelligent presets that respect Miller's Law
@attention-economics Preset hierarchy: linear=democratic attention, golden=hierarchical flow, bento=complex attention patterns, custom=user-defined
@trust-building Mathematical spacing (golden ratio), Miller's Law cognitive load limits, consistent preset behavior builds user confidence
@accessibility WCAG AAA compliance with keyboard navigation, screen reader patterns, and ARIA grid support for interactive layouts
@semantic-meaning Layout intelligence: linear=equal-priority content, golden=natural hierarchy, bento=content showcases with semantic asymmetry, custom=specialized layouts

@usage-patterns
DO: Linear - Product catalogs, image galleries, equal-priority content
DO: Golden - Editorial layouts, feature showcases, natural hierarchy
DO: Bento - Editorial layouts, dashboards, content showcases (use sparingly)
DO: Custom - Specialized layouts requiring specific configurations
NEVER: Decorative asymmetry without semantic meaning
NEVER: Exceed cognitive load limits (8 items max on wide screens)
```

---

## Input

```
@cognitive-load 4/10 - Data entry with validation feedback requires user attention
@attention-economics State hierarchy: default=ready, focus=active input, error=requires attention, success=validation passed
@trust-building Clear validation feedback, error recovery patterns, progressive enhancement
@accessibility Screen reader labels, validation announcements, keyboard navigation, high contrast support
@semantic-meaning Type-appropriate validation: email=format validation, password=security indicators, number=range constraints

@usage-patterns
DO: Always pair with descriptive Label component
DO: Use helpful placeholders showing format examples
DO: Provide real-time validation for user confidence
DO: Use appropriate input types for sensitive data
NEVER: Label-less inputs, validation only on submit, unclear error messages
```

---

## Label

```
@cognitive-load 2/10 - Provides clarity and reduces interpretation effort
@attention-economics Information hierarchy: field=required label, hint=helpful guidance, error=attention needed
@trust-building Clear requirement indication, helpful hints, non-punitive error messaging
@accessibility Form association, screen reader optimization, color-independent error indication
@semantic-meaning Variant meanings: field=input association, hint=guidance, error=validation feedback, success=confirmation

@usage-patterns
DO: Always associate with input using htmlFor/id
DO: Use importance levels to guide user attention
DO: Provide visual and semantic marking for required fields
DO: Adapt styling based on form vs descriptive context
NEVER: Orphaned labels, unclear or ambiguous text, missing required indicators
```

---

## Progress

```
@cognitive-load 4/10 - Moderate attention required for progress monitoring
@attention-economics Temporal attention: Holds user attention during wait states with clear progress indication
@trust-building Accurate progress builds user confidence, clear completion states and next steps
@accessibility Screen reader announcements, keyboard navigation, high contrast support
@semantic-meaning Progress communication: determinate=known duration, indeterminate=unknown duration, completed=finished state

@usage-patterns
DO: Provide accurate progress indication with time estimation
DO: Use visual patterns that match task characteristics
DO: Show clear completion states and next steps
DO: Optimize information density based on cognitive load
NEVER: Inaccurate progress bars, missing completion feedback, unclear time estimates
```

---

## Select

```
@cognitive-load 5/10 - Option selection with search functionality requires cognitive processing
@attention-economics State management: closed=compact display, open=full options, searching=filtered results
@trust-building Search functionality, clear selection indication, undo patterns for accidental selections
@accessibility Keyboard navigation, screen reader announcements, focus management, option grouping
@semantic-meaning Option structure: value=data, label=display, group=categorization, disabled=unavailable choices

@usage-patterns
DO: Use 3-12 choices for optimal cognitive load
DO: Provide clear, descriptive option text
DO: Pre-select most common/safe option when appropriate
DO: Enable search for 8+ options to reduce cognitive load
NEVER: Too many options without grouping, unclear option descriptions
```

---

## Sidebar

```
@cognitive-load 6/10 - Navigation system with state management and wayfinding intelligence
@attention-economics Secondary support system: Never competes with primary content, uses muted variants and compact sizing for attention hierarchy
@trust-building Spatial consistency builds user confidence, zustand state persistence remembers preferences, Miller's Law enforcement prevents cognitive overload
@accessibility WCAG AAA compliance with skip links, keyboard navigation, screen reader optimization, and motion sensitivity support
@semantic-meaning Navigation intelligence: Progressive disclosure for complex hierarchies, semantic grouping by domain, wayfinding through active state indication with zustand state machine

@usage-patterns
DO: Use for main navigation with collapsible state management
DO: Implement progressive disclosure for complex menu hierarchies
DO: Provide skip links and keyboard navigation patterns
DO: Integrate with zustand store for state persistence
NEVER: Complex menu logic within sidebar - use dedicated menu components
NEVER: Compete with primary content for attention
```

---

## Slider

```
@cognitive-load 3/10 - Value selection with immediate visual feedback
@attention-economics Value communication: visual track, precise labels, immediate feedback
@trust-building Immediate visual feedback, undo capability, clear value indication
@accessibility Keyboard increment/decrement, screen reader value announcements, touch-friendly handles
@semantic-meaning Range contexts: settings=configuration, filters=data selection, controls=media/volume

@usage-patterns
DO: Show current value and units for clarity
DO: Use large thumb size for mobile and accessibility
DO: Provide visual markers for discrete value ranges
DO: Give immediate feedback with real-time updates
NEVER: Invisible ranges, unclear min/max values, tiny touch targets
```

---

## Tabs

```
@cognitive-load 4/10 - Content organization with state management requires cognitive processing
@attention-economics Content organization: visible=current context, hidden=available contexts, active=user focus
@trust-building Persistent selection, clear active indication, predictable navigation patterns
@accessibility Arrow key navigation, tab focus management, panel association, screen reader support
@semantic-meaning Structure: tablist=navigation, tab=option, tabpanel=content, selected=current view

@usage-patterns
DO: Use for related content showing different views of same data/context
DO: Provide clear, descriptive, scannable tab names (7±2 maximum)
DO: Make active state visually prominent and immediately clear
DO: Arrange tabs by frequency or logical workflow sequence
NEVER: More than 7 tabs, unrelated content sections, unclear active state
```

---

## Toast

```
@cognitive-load 2/10 - Non-blocking notification requiring brief attention
@attention-economics Temporary interruption: Must be dismissible and time-appropriate for message urgency
@trust-building Immediate feedback for user actions builds confidence and confirms system responsiveness
@accessibility Screen reader announcements, keyboard dismissal, high contrast variants
@semantic-meaning Notification types: success=confirmation, error=failure with recovery, warning=caution, info=neutral updates

@usage-patterns
DO: Confirm successful operations (save, delete, send)
DO: Provide error recovery with clear next steps for failures
DO: Auto-dismiss info toasts (4-6 seconds), require user dismiss for errors
DO: Use semantic variants with appropriate colors and icons
NEVER: Critical information that shouldn't disappear, multiple simultaneous toasts
```

---

## Tooltip

```
@cognitive-load 2/10 - Contextual help without interrupting user workflow
@attention-economics Non-intrusive assistance: Smart delays prevent accidental triggers while ensuring help availability
@trust-building Reliable contextual guidance that builds user confidence through progressive disclosure
@accessibility Keyboard navigation, screen reader support, focus management, escape key handling
@semantic-meaning Contextual assistance: help=functionality explanation, definition=terminology clarification, action=shortcuts and outcomes, status=system state

@usage-patterns
DO: Explain functionality without overwhelming users
DO: Clarify terminology contextually when needed
DO: Show shortcuts and expected action outcomes
DO: Provide feedback on system state changes
NEVER: Include essential information that should be visible by default
```

---

## Summary: Cognitive Load Scale

| Component | Score | Category |
|-----------|-------|----------|
| Container | 0/10 | Invisible structure |
| Badge | 2/10 | Peripheral scanning |
| Breadcrumb | 2/10 | Navigation aid |
| Card | 2/10 | Simple container |
| Label | 2/10 | Clarity enhancement |
| Toast | 2/10 | Brief attention |
| Tooltip | 2/10 | Contextual help |
| Button | 3/10 | Simple action |
| Slider | 3/10 | Value selection |
| Grid | 4/10 | Layout intelligence |
| Input | 4/10 | Data entry |
| Progress | 4/10 | Progress monitoring |
| Tabs | 4/10 | Content organization |
| Chip | 5/10 | High visibility overlay |
| Select | 5/10 | Option selection |
| Dialog | 6/10 | Flow interruption |
| Sidebar | 6/10 | Navigation system |
