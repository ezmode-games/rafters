# Why the Registry Exists

## The Core Problem
AI doesn't have taste. When AI builds UI, it guesses at colors, spacing, hierarchy. The results look like AI made them.

## The Solution
Encode a designer's choices into data AI can query. Not values - **choices**.

## What Makes This Different

A typical design token system stores values:
```json
{ "spacing-4": "1rem" }
```

Rafters stores choices:
```json
{
  "name": "spacing-4",
  "value": "2rem",
  "computedValue": "1rem",
  "dependsOn": ["spacing-base"],
  "generationRule": "calc({spacing-base}*4)",
  "userOverride": {
    "previousValue": "1rem",
    "reason": "Design review found original too tight for touch targets"
  }
}
```

The AI sees:
- Math says 1rem
- Human chose 2rem
- Because touch targets

**That's not data. That's wisdom.**

## Why the Dependency Graph

Design choices have consequences. Change `spacing-base` and 50 derived tokens respond. The graph exists to:

1. **Cascade changes** - One edit propagates correctly
2. **Protect human judgment** - Overrides aren't silently erased
3. **Show impact** - Before you change something, see what depends on it

## Why Track Both Values

```typescript
{
  value: "2rem",        // What human chose
  computedValue: "1rem" // What system would produce
}
```

The system keeps computing. The human decision persists. AI can see both:
- "The system thinks X"
- "But the designer chose Y because Z"

## The Most Important Field

`userOverride.reason` is the most important field in the schema. It's the designer's voice persisting through every regeneration.

Without it, we have values. With it, we have intent.

## Self-Repair, Not Self-Override

When you clear an override with `COMPUTED`:
- Derived tokens regenerate from their rules
- Root tokens restore `previousValue`
- The cascade propagates

The system heals itself. But it never overwrites human judgment without explicit action.

## The Registry is Memory

Not memory like RAM. Memory like human memory - the accumulation of decisions that form judgment.

A designer spends years learning what works. Rafters captures that into queryable data. AI reads it and produces work that reflects those years of learning, not random guesses.

## One Sentence

**The registry exists to make design choices queryable, so AI reads decisions instead of guessing.**
