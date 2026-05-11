# @rafters/design-tokens

Design token system. Zod-schema-first. Pure infrastructure: storage, DAG, cascade, plugin protocol, persistence.

Domain code (color, motion, typography) lives in dedicated packages. Plugins register at app bootstrap; this package never imports `@rafters/color-utils`, `@rafters/math-utils`, or typography logic.

## Status

Clean-start rewrite. v1 lives at `@rafters/design-tokens-v1` (frozen, mounted for consumer migration). Apps stay on v1 until parity is proven via the parity harness in `test/parity/`.

## Phases

- **0** Freeze v1, scaffold v2 (this state).
- **1** Schema layer — every shape as a Zod schema with descriptions; types via `z.infer`.
- **2** Install-time validation gate — name collisions, shape contract, dependsOn resolvability, cycle-freeness.
- **3** Storage — persistence, registry (bidirectional DAG, no cascade options on set), snapshot.
- **4** Plugin protocol — pure `{ id, input, output, derive }`. No registry reads.
- **5** Cascade engine — topo-order, idempotent.
- **6** Parity harness — diff v1 vs v2 output token-for-token against the 240-token default set.
- **7** Consumer migration — one PR per consumer.
- **8** Delete v1.
