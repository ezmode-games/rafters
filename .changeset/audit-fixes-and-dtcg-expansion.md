---
"rafters": patch
---

Upstream improvements that cascade to CLI/MCP tool output:

- fix(resizable): correct handleIndex for multi-panel layouts (#930)
- fix(select): display label text instead of raw value in SelectValue (#931)
- fix(shared): harden JSDoc intelligence parsing with validateComponentIntelligence() and 21 new tests (#932)
- refactor(ui): add forwardRef and displayName to all subcomponents (#933)
- refactor(ui): remove dead underscore-prefixed props from 6 components (#934)
- refactor(ui): standardize asChild on slot primitive for proper event handler composition (#935)
- feat(design-tokens): add designer intent fields (userOverride, computedValue, generationRule) and relationship fields (pairedWith, conflictsWith, applicableComponents, requiredForComponents) to DTCG export (#918)
- feat(design-tokens): add AI intelligence metadata (trustLevel, cognitiveLoad, consequence, accessibilityLevel, appliesWhen) to DTCG export (#919)
- feat(ui): add rule-drop-zone primitive for block-targeting drops (#904)
