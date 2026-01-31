# Strict Pre-Edit Hook (Agent-Based)

The default `pre-edit-rafters.sh` injects reminders but doesn't enforce them.
For stricter enforcement, replace the command hook with an agent hook.

## Option 1: Prompt-Based (Fast, Single LLM Call)

Uses Haiku to make a quick judgment call:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Review this edit for Rafters compliance. Check: 1) No `any` types, 2) No arbitrary Tailwind values like -[400px], 3) React 19 pure (no side effects in render), 4) Uses existing utilities from @rafters/shared, @rafters/color-utils if applicable. Return {\"ok\": false, \"reason\": \"...\"} if violations found."
          }
        ]
      }
    ]
  }
}
```

## Option 2: Agent-Based (Thorough, Multi-Turn Verification)

Spawns a subagent that can read files and verify compliance:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "agent",
            "prompt": "Before allowing this edit to $FILE_PATH, verify Rafters compliance:\n\n1. Check if Claude read the target file first (should appear in conversation)\n2. If adding new utility code, verify no similar function exists in:\n   - packages/shared/src/\n   - packages/color-utils/src/\n   - packages/math-utils/src/\n3. Scan the new code for:\n   - `any` type (forbidden)\n   - Arbitrary Tailwind values like -[...] (forbidden)\n   - Side effects in React component render (forbidden)\n\nReturn {\"ok\": true} if compliant, or {\"ok\": false, \"reason\": \"specific violation\"} if not.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

## Option 3: Hybrid (Command + Agent Stop Hook)

Keep the lightweight command hook for reminders, add an agent Stop hook to verify before completion:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/pre-edit-rafters.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "Review all code changes made in this session for Rafters compliance:\n- No `any` types\n- No arbitrary Tailwind values\n- React 19 pure components\n- Tests written for new functionality\n- No reinvented utilities that exist in shared packages\n\nIf violations found, return {\"ok\": false, \"reason\": \"list violations with file:line\"}",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

## Recommendation

Start with the default command hook (injected reminders). If Claude keeps ignoring them, upgrade to the hybrid approach (Option 3) which catches violations at session end without slowing down every edit.
