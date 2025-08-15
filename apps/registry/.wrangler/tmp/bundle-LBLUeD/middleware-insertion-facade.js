import worker, * as OTHER_EXPORTS from '/Users/seansilvius/projects/claude/real-handy/rafters/apps/registry/src/index.ts';
import * as __MIDDLEWARE_0__ from '/Users/seansilvius/projects/claude/real-handy/rafters/node_modules/.pnpm/wrangler@4.26.1_@cloudflare+workers-types@4.20250726.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts';
import * as __MIDDLEWARE_1__ from '/Users/seansilvius/projects/claude/real-handy/rafters/node_modules/.pnpm/wrangler@4.26.1_@cloudflare+workers-types@4.20250726.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts';

export * from '/Users/seansilvius/projects/claude/real-handy/rafters/apps/registry/src/index.ts';
const MIDDLEWARE_TEST_INJECT = '__INJECT_FOR_TESTING_WRANGLER_MIDDLEWARE__';
export const __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  __MIDDLEWARE_0__.default,
  __MIDDLEWARE_1__.default,
];
export default worker;
