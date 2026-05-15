import {
  TokenRegistry as V1TokenRegistry,
  registryToTailwind as v1RegistryToTailwind,
  registryToTypeScript as v1RegistryToTypeScript,
  toDTCG as v1ToDTCG,
} from '@rafters/design-tokens-v1';
import { describe, expect, it } from 'vitest';
import { registryToTailwind, registryToTypeScript, toDTCG } from '../src/exporters/index.js';
import { generateBaseSystem as generateNew } from '../src/generators/index.js';
import { scalePlugin } from '../src/plugins/index.js';
import { TokenRegistry } from '../src/registry.js';

describe('exporters parity vs v1', () => {
  it('Tailwind exporter produces output of comparable shape', () => {
    const next = generateNew();
    const v1Registry = new V1TokenRegistry(next.allTokens);
    const newRegistry = new TokenRegistry(next.allTokens, [scalePlugin]);

    const v1Output = v1RegistryToTailwind(v1Registry);
    const newOutput = registryToTailwind(newRegistry);

    expect(newOutput.length).toBeGreaterThan(1000);
    expect(newOutput).toContain('@theme');
    expect(newOutput).toContain('--rafters-');
    expect(v1Output.length).toBeGreaterThan(1000);

    const lengthRatio = newOutput.length / v1Output.length;
    expect(lengthRatio).toBeGreaterThan(0.85);
    expect(lengthRatio).toBeLessThan(1.15);
  });

  it('TypeScript exporter produces output of comparable shape', () => {
    const next = generateNew();
    const v1Registry = new V1TokenRegistry(next.allTokens);
    const newRegistry = new TokenRegistry(next.allTokens, [scalePlugin]);

    const v1Output = v1RegistryToTypeScript(v1Registry);
    const newOutput = registryToTypeScript(newRegistry);

    expect(newOutput).toContain('export const tokens');
    expect(newOutput.length).toBeGreaterThan(100);
    expect(v1Output.length).toBeGreaterThan(100);

    const lengthRatio = newOutput.length / v1Output.length;
    expect(lengthRatio).toBeGreaterThan(0.85);
    expect(lengthRatio).toBeLessThan(1.15);
  });

  it('DTCG exporter round-trips through DTCG schema', () => {
    const next = generateNew();
    const v1Out = v1ToDTCG(next.allTokens);
    const newOut = toDTCG(next.allTokens);

    expect(newOut).toEqual(v1Out);
  });
});
