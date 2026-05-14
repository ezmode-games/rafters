/**
 * Exporter byte-shape fixtures.
 *
 * Locks the output of each exporter against the REPRESENTATIVE_TOKEN_SET via
 * vitest snapshots. Any unintended change to the byte-shape fails the test.
 * To accept an intentional change: `pnpm test -u`.
 *
 * The exporters under test are imported from @rafters/design-tokens-v1, which
 * is the current authoritative producer of the byte-shape. The fixture lock
 * lives in @rafters/design-tokens so the contract is co-located with the new
 * package; when exporters are re-implemented in this package they must match
 * these snapshots.
 */

import {
  registryToTailwind,
  registryToTypeScript,
  toDTCG,
  TokenRegistry as V1TokenRegistry,
} from '@rafters/design-tokens-v1';
import { describe, expect, it } from 'vitest';
import { REPRESENTATIVE_TOKEN_SET } from '../fixtures/tokens.js';

function makeRegistry(): V1TokenRegistry {
  const r = new V1TokenRegistry();
  for (const token of REPRESENTATIVE_TOKEN_SET) {
    r.add(token);
  }
  return r;
}

describe('exporter byte-shape', () => {
  it('Tailwind v4 output matches snapshot', async () => {
    const registry = makeRegistry();
    const out = await registryToTailwind(registry);
    expect(out).toMatchSnapshot();
  });

  it('TypeScript const exports match snapshot', () => {
    const registry = makeRegistry();
    const out = registryToTypeScript(registry);
    expect(out).toMatchSnapshot();
  });

  it('DTCG output matches snapshot', () => {
    const out = toDTCG(REPRESENTATIVE_TOKEN_SET);
    expect(out).toMatchSnapshot();
  });
});
