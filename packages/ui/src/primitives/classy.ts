/**
 * Classy — single smart class builder (cn + token-aware resolver)
 *
 * - Token refs are created with `token(key)` and resolved via a provided tokenMap.
 * - By default bracket/arbitrary Tailwind classes are disallowed and will be skipped with a warning.
 */

export type ClassObject = Record<string, unknown>;
export type ClassInput =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassObject
  | ClassInput[]
  | TokenRef;

export type TokenMap = (key: string) => string | null;

export interface ClassyOptions {
  tokenMap?: TokenMap;
  allowArbitrary?: boolean; // allow bracketed arbitrary values like w-[10px]
  warn?: (msg: string) => void;
  normalize?: (cls: string) => string;
}

export interface TokenRef {
  __classy_token: string;
}

export function token(key: string): TokenRef {
  return { __classy_token: key };
}

function isTokenRef(v: unknown): v is TokenRef {
  return !!v && typeof v === 'object' && typeof (v as TokenRef).__classy_token === 'string';
}

function defaultWarn(msg: string) {
  // keep it quiet in tests unless console.warn is stubbed
  if (typeof console !== 'undefined' && console && console.warn) console.warn(msg);
}

function isBracketClass(s: string) {
  return /\[.*\]/.test(s);
}

function flatten(inputs: ClassInput[], out: unknown[] = []) {
  for (const i of inputs) {
    if (i == null || i === false) continue;
    if (Array.isArray(i)) flatten(i, out as ClassInput[]);
    else out.push(i);
  }
  return out;
}

export function createClassy(options?: ClassyOptions) {
  const tokenMap = options?.tokenMap;
  const allowArbitrary = !!options?.allowArbitrary;
  const warn = options?.warn ?? defaultWarn;
  const normalize = options?.normalize ?? ((s: string) => s);

  function build(...inputs: ClassInput[]) {
    const flat = flatten(inputs as ClassInput[]);
    const seen = new Set<string>();
    const out: string[] = [];

    for (const item of flat) {
      if (item == null || item === false) continue;

      // Token ref
      if (isTokenRef(item)) {
        const key = item.__classy_token;
        if (tokenMap) {
          const resolved = tokenMap(key);
          if (resolved) {
            // resolved may contain multiple space-separated classes
            for (const part of String(resolved).split(/\s+/).filter(Boolean)) {
              if (!allowArbitrary && isBracketClass(part)) {
                warn(`classy: arbitrary class '${part}' skipped`);
                continue;
              }
              const norm = normalize(part);
              if (!seen.has(norm)) {
                seen.add(norm);
                out.push(norm);
              }
            }
          } else {
            warn(`classy: unknown token '${key}'`);
          }
        } else {
          warn(`classy: token '${key}' used but no tokenMap provided`);
        }

        continue;
      }

      // Object form
      if (typeof item === 'object') {
        for (const k of Object.keys(item as ClassObject)) {
          const v = (item as ClassObject)[k];
          if (v) {
            // k may be a tokenRef string marker? we treat as literal class
            if (typeof k === 'string') {
              for (const part of k.split(/\s+/).filter(Boolean)) {
                if (!allowArbitrary && isBracketClass(part)) {
                  warn(`classy: arbitrary class '${part}' skipped`);
                  continue;
                }
                const norm = normalize(part);
                if (!seen.has(norm)) {
                  seen.add(norm);
                  out.push(norm);
                }
              }
            }
          }
        }

        continue;
      }

      // Primitive (string/number/boolean)
      const s = String(item);
      for (const part of s.split(/\s+/).filter(Boolean)) {
        if (!allowArbitrary && isBracketClass(part)) {
          warn(`classy: arbitrary class '${part}' skipped`);
          continue;
        }
        const norm = normalize(part);
        if (!seen.has(norm)) {
          seen.add(norm);
          out.push(norm);
        }
      }
    }

    return out.join(' ').trim();
  }

  const instance = Object.assign(build, {
    token,
    create: createClassy,
  });

  return instance as typeof build & { token: typeof token; create: typeof createClassy };
}

// default singleton
export const classy = createClassy();

export default classy;
