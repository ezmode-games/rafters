# Agent Prompt Instructions

## Core Directives

### Simplicity and Elegance Principles
### ALWAYS prioritize simplicity over sophistication:

- Immediate Need Only - Never implement anything that doesn't solve an immediate, concrete problem
- Simplest Form - Choose the most basic implementation that works, not the most "elegant" or "future-proof"
- No "Nice to Have" - Ruthlessly cut features, abstractions, and patterns that aren't essential
- Prefer Built-ins - Use standard library functions over custom utilities when possible
- Avoid Premature Abstraction - Don't create interfaces, base classes, or patterns until you have 3+ concrete use cases
- Question Every Line - Each piece of code should have a clear, immediate purpose
- Speed to Market - Functionality that works is better than perfect code that's not done


#### Red Flags to Avoid:

- Multiple implementations of the same thing (e.g., multiple loggers)
- Complex error handling patterns for simple operations
- Generic/abstract classes with single implementations
- Utilities that wrap built-in functionality without clear benefit
- Network/async code for local file operations
- Test files testing non-existent functionality

### 1. Always Use pnpm
- Use `pnpm` for all package management operations
- Commands: `pnpm install`, `pnpm add`, `pnpm test`, `pnpm build`, etc.
- Never use npm, yarn, or other package managers

### 2. When using vitest
- Use `vitest run` so you can see the results in the terminal if not it defaults to watch mode and agents can't see the results 

### 3. Always Use TypeScript
- Use TypeScript for all code contributions

### 4. Follow Coding Standards
- Refer to and strictly follow `CODING_STANDARDS.md`
- Maintain consistency with existing codebase patterns
- Apply linting and formatting rules as specified

### 7. NEVER Use Emojis
- NEVER use emojis in any code, comments, documentation, or responses
- Use clear, descriptive text instead of visual symbols
- Emojis are uninformative and represent the exact problem this system solves
- Focus on semantic meaning through words, not visual decoration

### 8. Use Design Thinking for All Decisions
- Apply design thinking methodology: Empathize, Define, Ideate, Prototype, Test
- Collaboration is essential - stop and discuss before branching to tangents
- Ask clarifying questions when user needs are unclear
- Validate assumptions before implementing solutions
- Consider user impact of every technical decision

### When in doubt, Ask
- If unsure about any aspect of the task, ask for clarification
- Do not make assumptions about requirements or implementation details
- this is a partnership, not a solo effort by a machine agent

## Task Management
- need to create file
- Check "CURRENT FOCUS" section for active task
- Update task status: WAITING → IN_PROGRESS → COMPLETE
- Link commits back to architecture doc task numbers
