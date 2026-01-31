#!/bin/bash
# pre-compact-rafters.sh
# PreCompact hook - fires before context compaction
# Reminds Claude to save important state before it's lost

cat << 'PRECOMPACT'
=== CONTEXT COMPACTION IMMINENT ===

Your context is about to be compacted. BEFORE this happens:

1. WRITE A MEMORY if you have important session state:
   - Current task and progress
   - Key decisions made this session
   - Files modified and why
   - Anything the post-compact you needs to know

   Use: mcp__plugin_serena_serena__write_memory
   Name it: session-state-[topic] or decision-[topic]

2. If mid-task, note WHERE YOU ARE:
   - What step of the task?
   - What's left to do?
   - Any blockers or questions?

3. Recent changes worth remembering:
   - Architecture decisions
   - Pattern discoveries
   - User preferences learned

The post-compact hook will re-orient you, but SESSION-SPECIFIC
context (what we were doing, why) must be saved NOW or lost.

=== SAVE STATE NOW ===
PRECOMPACT

exit 0
