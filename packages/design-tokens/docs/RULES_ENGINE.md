# Rafters Rules Engine

## Overview

The Rafters Rules Engine uses a wheel/adapter pattern for pluggable token validation and intelligent cascade logic. Each rule is a "spoke" that can be added or removed, enabling extensibility from OSS to Rafters+ to custom enterprise needs.

## Architecture Pattern

### Wheel/Adapter Design
```typescript
interface TokenRule {
  name: string;
  priority: number;
  version: string;

  // Check if this rule applies to the token change
  applies(token: string, context: RuleContext): boolean;

  // Evaluate and return issues/fixes
  evaluate(token: string, value: ColorValue, context: RuleContext): RuleResult;

  // Apply fixes if validation fails
  applyFixes?(fixes: Fix[], registry: TokenRegistry): Promise<void>;
}

class TokenRulesEngine {
  private rules: Map<string, TokenRule> = new Map();

  // Plugin loading (Ruby-style convention)
  loadRulesFromDirectory(path: string): void {
    const ruleFiles = glob.sync(`${path}/*.rule.{js,ts}`);

    for (const file of ruleFiles) {
      const RuleClass = require(file);
      if (RuleClass.implements?.(TokenRule)) {
        this.addRule(new RuleClass());
      }
    }
  }

  addRule(rule: TokenRule): void {
    this.rules.set(rule.name, rule);
  }

  removeRule(name: string): void {
    this.rules.delete(name);
  }

  // Execute applicable rules in priority order
  async evaluate(token: string, value: ColorValue): Promise<RuleResult[]> {
    const context = this.buildContext(token, value);

    const applicable = Array.from(this.rules.values())
      .filter(rule => rule.applies(token, context))
      .sort((a, b) => a.priority - b.priority);

    const results: RuleResult[] = [];

    for (const rule of applicable) {
      try {
        const result = await rule.evaluate(token, value, context);
        results.push(result);

        // Auto-apply critical fixes
        if (result.severity === 'critical' && result.autoFix && rule.applyFixes) {
          await rule.applyFixes(result.fixes, this.registry);
        }
      } catch (error) {
        console.warn(`Rule ${rule.name} failed:`, error);
      }
    }

    return results;
  }
}
```

## Rule Types & Tiers

### OSS Core Rules (Free)
Essential rules that ship with Rafters for basic safety and consistency:

```typescript
// 1. WCAG Contrast Rule - Ensures accessibility compliance
class WCAGContrastRule implements TokenRule {
  name = 'wcag-contrast';
  priority = 1; // Highest priority - accessibility is non-negotiable

  applies(token: string): boolean {
    return token.includes('-foreground') || token.includes('-background');
  }

  async evaluate(token: string, value: ColorValue, context: RuleContext): Promise<RuleResult> {
    const baseToken = this.getBaseToken(token);
    const contrastRatio = calculateContrast(value, baseToken);

    if (contrastRatio < 4.5) {
      return {
        severity: 'critical',
        autoFix: true,
        message: `Contrast ratio ${contrastRatio.toFixed(2)}:1 fails WCAG AA (4.5:1 required)`,
        fixes: [{
          type: 'update-token',
          token: token,
          value: findBestContrast(baseToken, 'AA'),
          reason: 'Auto-updated for WCAG AA compliance'
        }]
      };
    }

    return { valid: true };
  }

  async applyFixes(fixes: Fix[], registry: TokenRegistry): Promise<void> {
    for (const fix of fixes) {
      registry.set(fix.token, fix.value);
      registry.addLog(`Auto-fixed: ${fix.reason}`);
    }
  }
}

// 2. Color Scale Consistency Rule
class ColorScaleRule implements TokenRule {
  name = 'color-scale-consistency';
  priority = 5;

  applies(token: string): boolean {
    return token.includes('-hover') || token.includes('-active') || token.includes('-focus');
  }

  async evaluate(token: string, value: ColorValue, context: RuleContext): Promise<RuleResult> {
    const family = this.extractColorFamily(token);
    const state = this.extractState(token);

    // Check if state follows expected scale progression
    const expectedIndex = this.getExpectedScaleIndex(state);
    const actualIndex = family.scale.findIndex(color => isSameColor(color, value));

    if (Math.abs(actualIndex - expectedIndex) > 1) {
      return {
        severity: 'warning',
        autoFix: false,
        message: `${state} state uses scale[${actualIndex}], expected around scale[${expectedIndex}]`,
        suggestions: [
          `Consider using ${family.name}-${expectedIndex * 100} for more predictable state progression`
        ]
      };
    }

    return { valid: true };
  }
}

// 3. State Progression Rule
class StateProgressionRule implements TokenRule {
  name = 'state-progression';
  priority = 3;

  applies(token: string): boolean {
    return /-(hover|active|focus|disabled)$/.test(token);
  }

  async evaluate(token: string, value: ColorValue, context: RuleContext): Promise<RuleResult> {
    const baseToken = token.replace(/-(hover|active|focus|disabled)$/, '');
    const baseValue = context.registry.get(baseToken);

    // Validate logical state progression
    const progression = this.calculateProgression(baseValue, value);

    if (progression.illogical) {
      return {
        severity: 'warning',
        autoFix: false,
        message: `${token} progression seems illogical: ${progression.reason}`,
        suggestions: progression.suggestions
      };
    }

    return { valid: true };
  }
}

// 4. Color Family Coherence Rule
class ColorFamilyRule implements TokenRule {
  name = 'color-family-coherence';
  priority = 7;

  applies(token: string): boolean {
    return true; // Applies to all color tokens
  }

  async evaluate(token: string, value: ColorValue, context: RuleContext): Promise<RuleResult> {
    if (this.isCompleteDifferentFamily(token, value, context)) {
      return {
        severity: 'info',
        autoFix: false,
        message: `${token} uses a completely different color family - this may feel jarring to users`,
        suggestions: [
          'Consider using a different shade from the same family',
          'If intentional, ensure good contrast with related tokens'
        ]
      };
    }

    return { valid: true };
  }
}
```

### Rafters+ AI Rules (Premium)
Advanced AI-powered rules for sophisticated design systems:

```typescript
// AI Brand Consistency Rule
class AIBrandConsistencyRule implements TokenRule {
  name = 'ai-brand-consistency';
  priority = 10;
  requiresAPI = ['claude'];

  applies(token: string): boolean {
    return true; // AI can evaluate any token
  }

  async evaluate(token: string, value: ColorValue, context: RuleContext): Promise<RuleResult> {
    const brandGuidelines = context.registry.getBrandGuidelines();
    const prompt = `
      Analyze if this color token maintains brand consistency:

      Token: ${token}
      Color: ${value.name} (${JSON.stringify(value.scale[5])})
      Brand Guidelines: ${brandGuidelines}
      Current Palette: ${JSON.stringify(context.palette)}

      Return JSON:
      {
        "consistent": boolean,
        "confidence": number,
        "issues": string[],
        "improvements": string[]
      }
    `;

    const response = await claude.complete(prompt, { max_tokens: 200 });

    if (!response.consistent) {
      return {
        severity: 'warning',
        autoFix: false,
        message: `AI detected brand inconsistency (${response.confidence}% confidence)`,
        issues: response.issues,
        suggestions: response.improvements
      };
    }

    return { valid: true };
  }
}

// AI Emotional Cohesion Rule
class AIEmotionalCohesionRule implements TokenRule {
  name = 'ai-emotional-cohesion';
  priority = 12;
  requiresAPI = ['claude'];

  async evaluate(token: string, value: ColorValue, context: RuleContext): Promise<RuleResult> {
    const prompt = `
      Analyze emotional cohesion of this color within the system:

      New Color: ${value.name}
      Role: ${token}
      Existing Palette: ${JSON.stringify(context.emotionalMap)}

      Does this create emotional dissonance? Return JSON with cohesion analysis.
    `;

    const analysis = await claude.complete(prompt, { max_tokens: 150 });

    if (analysis.dissonance > 0.7) {
      return {
        severity: 'info',
        message: `High emotional dissonance detected (${analysis.dissonance})`,
        suggestions: analysis.harmonization_tips
      };
    }

    return { valid: true };
  }
}
```

### Custom Enterprise Rules
Companies can build domain-specific rules:

```typescript
// Healthcare Compliance Rule
class HIPAAColorRule implements TokenRule {
  name = 'hipaa-compliance';
  priority = 2;

  applies(token: string): boolean {
    return token.includes('patient') || token.includes('medical');
  }

  async evaluate(token: string, value: ColorValue): Promise<RuleResult> {
    // Ensure medical interface colors meet healthcare standards
    if (this.violatesHIPAAGuidelines(value)) {
      return {
        severity: 'critical',
        autoFix: true,
        message: 'Color violates HIPAA interface guidelines',
        fixes: [/* HIPAA-compliant alternatives */]
      };
    }

    return { valid: true };
  }
}

// Finance Industry Rule
class FinanceComplianceRule implements TokenRule {
  name = 'finance-compliance';
  priority = 2;

  async evaluate(token: string, value: ColorValue): Promise<RuleResult> {
    // Ensure colors meet financial industry accessibility standards
    // Often stricter than general WCAG requirements
  }
}
```

## Plugin Loading Strategy

### Directory Convention (Ruby-style)
```
.rafters/
  plugins/
    core/
      wcag-contrast.rule.ts        # OSS core rules
      color-scale.rule.ts
      state-progression.rule.ts
    premium/                       # Rafters+ rules (downloaded on auth)
      ai-brand-consistency.rule.ts
      ai-emotional-cohesion.rule.ts
    custom/                        # User/company rules
      company-brand.rule.ts
      industry-compliance.rule.ts
```

### Loading Logic
```typescript
class RulesLoader {
  async loadRules(registry: TokenRegistry): Promise<void> {
    // Always load core OSS rules
    await this.loadFromDirectory('.rafters/plugins/core/');

    // Load premium rules if authenticated
    if (await this.isRaftersPlusUser()) {
      await this.downloadPremiumRules();
      await this.loadFromDirectory('.rafters/plugins/premium/');
    }

    // Load custom rules
    await this.loadFromDirectory('.rafters/plugins/custom/');
  }

  private async loadFromDirectory(path: string): Promise<void> {
    const ruleFiles = glob.sync(`${path}*.rule.{js,ts}`);

    for (const file of ruleFiles) {
      try {
        const RuleClass = await import(file);
        if (this.isValidRule(RuleClass)) {
          const rule = new RuleClass();
          this.engine.addRule(rule);
        }
      } catch (error) {
        console.warn(`Failed to load rule ${file}:`, error);
      }
    }
  }
}
```

## Rule Context

Rules receive rich context for intelligent evaluation:

```typescript
interface RuleContext {
  registry: TokenRegistry;
  currentToken: string;
  newValue: ColorValue;

  // Design system context
  palette: Record<string, ColorValue>;
  semanticRoles: Record<string, string>;
  brandGuidelines?: string;

  // Accessibility context
  targetWCAGLevel: 'AA' | 'AAA';
  colorVisionTypes: ColorVisionType[];

  // User context
  isRaftersPlus: boolean;
  customSettings: Record<string, any>;

  // Change context
  changeType: 'user-override' | 'cascade' | 'initial-load';
  triggeredBy?: string; // Which token change triggered this
}
```

## Rule Results

Standardized result format for all rules:

```typescript
interface RuleResult {
  valid: boolean;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  autoFix?: boolean;

  // Human-readable feedback
  message?: string;
  issues?: string[];
  suggestions?: string[];

  // Automated fixes
  fixes?: Fix[];

  // Metadata
  rule: string;
  confidence?: number;
  executionTime?: number;
}

interface Fix {
  type: 'update-token' | 'add-token' | 'remove-token' | 'cascade-update';
  token: string;
  value?: ColorValue | string;
  reason: string;
}
```

## Integration with Registry

The rules engine integrates seamlessly with the TokenRegistry:

```typescript
class TokenRegistry {
  private rulesEngine: TokenRulesEngine;

  async updateToken(token: string, value: ColorValue): Promise<void> {
    // Run rules before updating
    const results = await this.rulesEngine.evaluate(token, value);

    // Handle critical issues
    const criticalIssues = results.filter(r => r.severity === 'critical');
    if (criticalIssues.length > 0) {
      // Auto-fix critical issues (accessibility, compliance)
      for (const issue of criticalIssues) {
        if (issue.autoFix && issue.fixes) {
          this.applyFixes(issue.fixes);
        }
      }
    }

    // Update the token
    this.tokens.set(token, value);

    // Log all results for user feedback
    this.logRuleResults(results);

    // Cascade changes if rules suggest it
    await this.cascadeIfNeeded(token, results);
  }

  private logRuleResults(results: RuleResult[]): void {
    for (const result of results) {
      if (!result.valid) {
        this.addWarning({
          rule: result.rule,
          message: result.message,
          severity: result.severity,
          suggestions: result.suggestions
        });
      }
    }
  }
}
```

## Performance Considerations

### Rule Prioritization
- **Priority 1-5**: Critical safety rules (run first, auto-fix)
- **Priority 6-10**: Design consistency rules (warn, suggest)
- **Priority 11+**: AI enhancement rules (enrich, inform)

### Caching Strategy
```typescript
class RuleCache {
  private cache = new Map<string, RuleResult>();

  getCached(token: string, valueHash: string): RuleResult | null {
    return this.cache.get(`${token}:${valueHash}`);
  }

  setCached(token: string, valueHash: string, result: RuleResult): void {
    this.cache.set(`${token}:${valueHash}`, result);
  }
}
```

### Async Execution
```typescript
// Critical rules run synchronously
const criticalResults = await this.runCriticalRules(token, value);

// Non-critical rules run in background
this.runNonCriticalRules(token, value).then(results => {
  this.updateUI(results);
});
```

## Benefits

### For Users
- **Safe by default** - Core rules prevent accessibility violations
- **Educational** - Rules explain why changes were made
- **Flexible** - Can disable rules that don't fit their needs

### For Rafters OSS
- **Competitive differentiation** - Intelligence beyond basic tokens
- **Community extensibility** - Users build and share rules
- **Quality assurance** - Prevents broken design systems

### For Rafters+
- **Clear upgrade path** - AI rules provide obvious premium value
- **Stickiness** - Custom rules create lock-in
- **Enterprise appeal** - Compliance rules for regulated industries

## Future Extensions

### Community Rules Marketplace
```typescript
// Users can publish and share rules
class RulesMarketplace {
  async publishRule(rule: TokenRule): Promise<string> {
    // Validate, test, and publish rule
  }

  async installRule(ruleId: string): Promise<void> {
    // Download and install community rule
  }
}
```

### Visual Rule Builder
```typescript
// Studio UI for building custom rules without code
interface VisualRuleBuilder {
  conditions: RuleCondition[];
  actions: RuleAction[];
  trigger: 'token-change' | 'system-load' | 'user-action';
}
```

The rules engine provides a foundation for intelligent design systems that grow with users' needs while maintaining safety and consistency.