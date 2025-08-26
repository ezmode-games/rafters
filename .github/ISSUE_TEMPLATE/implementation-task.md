---
name: Implementation Task
about: SOLID implementation task for AI agents
title: "Implement [Feature Name] - [Brief Description]"
labels: enhancement
assignees: ''
---

## Goal

**Single, focused objective this task achieves.**

## Exact Implementation Requirements

### Required Interface/Class Structure
```typescript
// Exact method signatures, class structure, or API expected
```

### Behavior Requirements
- Specific requirement 1 with clear success criteria
- Specific requirement 2 with measurable outcome
- Specific requirement 3 with validation method

### Error Handling
- What errors to throw and when
- Required error message format
- Recovery strategies if applicable

## Acceptance Criteria

### Functional Tests Required
```typescript
// Exact test cases that must pass
// Include setup, execution, and assertions
expect(result).toBe(expectedValue);
expect(() => invalidOperation()).toThrow('Specific error message');
```

### Performance Requirements
- Specific performance metrics if applicable
- Memory usage constraints if relevant
- Algorithmic complexity requirements if needed

### TypeScript Requirements
- All types must be explicit (no `any` types)
- Required interfaces or type definitions
- Generic constraints if applicable

## What NOT to Include

- Feature 1 that's out of scope (separate issue)
- Feature 2 that's not needed yet (future consideration)  
- Complex feature that should be broken down further

## File Locations

- Implementation: `path/to/implementation.ts`
- Tests: `path/to/tests.test.ts`
- Types: `path/to/types.ts` (if needed)
- Export from: `path/to/index.ts`

## Integration Requirements

### Dependencies
- Required packages or modules
- Integration points with existing code
- Compatibility requirements

### Usage Examples
```typescript
// Concrete examples of how this will be used
const example = new Implementation();
const result = example.method(parameters);
```

## Success Criteria

- [ ] All functional tests pass
- [ ] TypeScript compiles without errors (no `any` types)
- [ ] Performance requirements met
- [ ] Integration tests pass
- [ ] Documentation updated if required
- [ ] Exports added to index files

**This issue is complete when:** [Specific, measurable completion condition]

## Context & References

- Related issues: #123, #456
- Architectural documentation: Link to relevant specs
- External dependencies: Links to library docs if needed