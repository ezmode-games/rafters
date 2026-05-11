import type { Token as V1Token } from '@rafters/shared';
import { NAMESPACES, type Namespace, type Token, type TokenValue } from '../../src/index.js';

const NAMESPACE_SET = new Set<string>(NAMESPACES);

export type ProjectionIssueCode =
  | 'unknown-namespace'
  | 'unparseable-value'
  | 'invalid-id'
  | 'unrepresentable-value';

export interface ProjectionIssue {
  v1Name: string;
  code: ProjectionIssueCode;
  detail: string;
}

export interface ProjectionResult {
  tokens: Token[];
  issues: ProjectionIssue[];
}

const OKLCH_RE = /^oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)$/i;
const VAR_RE = /^var\(--[a-z0-9-]+\)$/i;
const NUMBER_UNIT_RE = /^(-?\d+(?:\.\d+)?)\s*(px|rem|em|ms|s|%|fr)?$/;

const KNOWN_UNITS = new Set(['px', 'rem', 'em', 'ms', 's', '%', 'fr']);

export function projectV1Token(v1: V1Token): { token?: Token; issue?: ProjectionIssue } {
  if (!NAMESPACE_SET.has(v1.namespace)) {
    return {
      issue: {
        v1Name: v1.name,
        code: 'unknown-namespace',
        detail: `Namespace "${v1.namespace}" is not in the v2 enum.`,
      },
    };
  }
  const namespace = v1.namespace as Namespace;
  const id = toV2Id(namespace, v1.name);

  if (!/^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/.test(id)) {
    return {
      issue: {
        v1Name: v1.name,
        code: 'invalid-id',
        detail: `Generated id "${id}" does not match v2 TokenId regex.`,
      },
    };
  }

  const value = projectValue(v1.value);
  if (!value) {
    return {
      issue: {
        v1Name: v1.name,
        code: 'unparseable-value',
        detail: `Could not project value to v2 shape.`,
      },
    };
  }

  const dependsOn = projectDependsOn(v1, namespace);

  const token: Token = {
    id,
    namespace,
    value,
    dependsOn,
    metadata: collectMetadata(v1),
    source: v1.userOverride ? 'user' : 'default',
  };
  return { token };
}

export function projectAll(v1Tokens: readonly V1Token[]): ProjectionResult {
  const tokens: Token[] = [];
  const issues: ProjectionIssue[] = [];
  for (const v1 of v1Tokens) {
    const { token, issue } = projectV1Token(v1);
    if (token) tokens.push(token);
    if (issue) issues.push(issue);
  }
  return { tokens, issues };
}

function toV2Id(namespace: Namespace, name: string): string {
  const sanitized = name.toLowerCase();
  if (sanitized.startsWith(`${namespace}.`)) return sanitized;
  return `${namespace}.${sanitized}`;
}

function projectValue(raw: unknown): TokenValue | undefined {
  if (typeof raw === 'string') return projectStringValue(raw);
  if (raw && typeof raw === 'object') return projectObjectValue(raw as Record<string, unknown>);
  return undefined;
}

function projectStringValue(s: string): TokenValue | undefined {
  const trimmed = s.trim();
  if (trimmed === '') return { kind: 'string', value: '' };

  const oklch = OKLCH_RE.exec(trimmed);
  if (oklch) {
    const [, lStr, cStr, hStr, alphaStr] = oklch;
    const l = Number(lStr);
    const c = Number(cStr);
    const h = Number(hStr);
    if (!Number.isFinite(l) || !Number.isFinite(c) || !Number.isFinite(h)) return undefined;
    if (alphaStr !== undefined) {
      const alpha = Number(alphaStr);
      if (Number.isFinite(alpha)) return { kind: 'color', l, c, h, alpha };
    }
    return { kind: 'color', l, c, h };
  }

  if (VAR_RE.test(trimmed)) {
    return { kind: 'reference', ref: trimmed.slice(6, -1) };
  }

  const num = NUMBER_UNIT_RE.exec(trimmed);
  if (num) {
    const [, valueStr, unit] = num;
    const value = Number(valueStr);
    if (!Number.isFinite(value)) return undefined;
    const resolvedUnit = unit && KNOWN_UNITS.has(unit) ? unit : 'unitless';
    return {
      kind: 'number',
      value,
      unit: resolvedUnit as 'px' | 'rem' | 'em' | 'ms' | 's' | '%' | 'fr' | 'unitless',
    };
  }

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const obj = JSON.parse(trimmed) as Record<string, unknown>;
      const composite = projectObjectValue(obj);
      if (composite) return composite;
    } catch {
      // fall through to opaque string
    }
  }

  return { kind: 'string', value: s };
}

function projectObjectValue(obj: Record<string, unknown>): TokenValue | undefined {
  if (typeof obj.family === 'string' && obj.position !== undefined) {
    return { kind: 'reference', ref: `color.${obj.family}-${String(obj.position)}` };
  }

  const fields: Record<string, TokenValue> = {};
  for (const [key, raw] of Object.entries(obj)) {
    let projected: TokenValue | undefined;
    if (typeof raw === 'string') projected = projectStringValue(raw);
    else if (typeof raw === 'number') projected = { kind: 'number', value: raw, unit: 'unitless' };
    else if (typeof raw === 'boolean') projected = { kind: 'string', value: String(raw) };
    if (!projected) continue;
    if (projected.kind === 'composite') continue;
    fields[key] = projected;
  }
  if (Object.keys(fields).length === 0) return undefined;
  return { kind: 'composite', fields: fields as Record<string, never> } as TokenValue;
}

function projectDependsOn(v1: V1Token, namespace: Namespace): Token['dependsOn'] {
  if (!v1.generationRule || !v1.dependsOn || v1.dependsOn.length === 0) return [];
  const { plugin, args } = parseGenerationRule(v1.generationRule);
  if (!plugin) return [];
  const sourceName = v1.dependsOn[0];
  if (!sourceName) return [];
  const sourceId = sourceName.includes('.') ? sourceName : `${namespace}.${sourceName}`;
  return [{ source: sourceId, plugin, args }];
}

function parseGenerationRule(rule: string): {
  plugin: string | null;
  args: Record<string, unknown>;
} {
  if (rule.startsWith('calc(')) {
    const inner = rule.slice(5, -1);
    const m = /\{[^}]+\}\s*\*\s*([0-9.]+)/.exec(inner);
    if (m?.[1] !== undefined) return { plugin: 'calc', args: { factor: Number(m[1]) } };
    return { plugin: 'calc', args: { expr: inner } };
  }
  if (rule === 'state:hover') return { plugin: 'state-hover', args: {} };
  if (rule === 'state:active') return { plugin: 'state-active', args: {} };
  if (rule === 'state:disabled') return { plugin: 'state-disabled', args: {} };
  if (rule.startsWith('scale:')) {
    const position = rule.slice(6);
    return { plugin: 'scale', args: { position } };
  }
  if (rule === 'contrast:auto') return { plugin: 'contrast-auto', args: {} };
  if (rule === 'invert') return { plugin: 'invert', args: {} };
  return { plugin: null, args: {} };
}

function collectMetadata(v1: V1Token): Record<string, unknown> {
  const meta: Record<string, unknown> = {};
  if (v1.description) meta.description = v1.description;
  if (v1.semanticMeaning) meta.semanticMeaning = v1.semanticMeaning;
  if (v1.usageContext) meta.usageContext = v1.usageContext;
  if (v1.deprecated) meta.deprecated = v1.deprecated;
  if (v1.userOverride) meta.userOverride = v1.userOverride;
  if (v1.computedValue !== undefined) meta.computedValue = v1.computedValue;
  if (v1.scalePosition !== undefined) meta.scalePosition = v1.scalePosition;
  if (v1.progressionSystem) meta.progressionSystem = v1.progressionSystem;
  return meta;
}
