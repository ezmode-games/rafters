# Registry Deployment Notes

## @rafters/* Dependency Exclusion
JSDoc examples in UI components reference `@rafters/ui` imports. The registry was incorrectly detecting these as npm dependencies.

### Fix in `apps/website/src/lib/registry/componentService.ts`:
```typescript
const EXCLUDED_PREFIXES = ['@rafters/'];

function versionDeps(deps: string[]): string[] {
  return deps
    .filter((dep) => !EXCLUDED_DEPS.has(dep))
    .filter((dep) => !EXCLUDED_PREFIXES.some((prefix) => dep.startsWith(prefix)))
    .map((dep) => { /* version mapping */ });
}
```

## Cloudflare Custom Domain Route
Custom domains in wrangler.jsonc cannot have `/*` pattern.

### Wrong:
```json
"routes": [{ "pattern": "rafters.studio/*", ... }]
```

### Correct:
```json
"routes": [{ "pattern": "rafters.studio", ... }]
```

## Registry URL
- Production: https://rafters.studio/registry/components/{name}.json
- Components served from Cloudflare Workers
