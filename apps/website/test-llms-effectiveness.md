# Testing LLMs.txt Effectiveness

## Test Prompt for AI Agents (No Prior Knowledge)

```
You are building a React application. You found this llms.txt file at a project. Based ONLY on this information, complete these tasks:

1. Install a button component
2. Create a login form 
3. Add a delete user feature
4. Build a settings page with multiple options

Here is the llms.txt content:
[PASTE LLMS.TXT HERE]

Show me the code you would write.
```

## Test Scenarios

### Scenario 1: Basic Understanding
Can the AI agent figure out how to install and use a component?
- Expected: `npx rafters@latest add button`
- Expected: Uses shadcn-style code

### Scenario 2: Applying Intelligence
Does the AI agent apply the cognitive load rule?
- Expected: Keeps sections under 15 total
- Expected: Only one primary button per section

### Scenario 3: Trust Patterns
Does the AI agent understand destructive actions need confirmation?
- Expected: Uses variant="destructive" for delete
- Expected: Understands Rafters auto-adds confirmation

### Scenario 4: Motion & Accessibility
Does the AI agent mention or utilize the motion system and accessibility features?
- Expected: May not actively use but should know they're automatic

## What We're Looking For

1. **Can they install components?** (Basic functionality)
2. **Do they understand it's shadcn-compatible?** (Pattern matching)
3. **Do they apply the cognitive load rule?** (Using intelligence)
4. **Do they know about automatic features?** (Better defaults)
5. **Can they access the API for more info?** (Advanced usage)

## Red Flags (llms.txt needs improvement if):

- AI doesn't understand installation command
- AI doesn't know it's shadcn-compatible
- AI doesn't understand automatic features
- AI can't find the API endpoints
- AI is confused about what Rafters is

## Test Agents to Try

1. **Claude 3.5 Sonnet** (older, might not know modern patterns)
2. **GPT-4** (different training data)
3. **Fresh Claude instance** (no conversation history)
4. **Gemini** (completely different model family)
5. **Local models** (Llama, Mistral - limited training data)