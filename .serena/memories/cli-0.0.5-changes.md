# CLI Changes (v0.0.3 - v0.0.5)

## Pretty Output (v0.0.3)
- Created `packages/cli/src/utils/ui.ts` with ora spinners
- `--agent` flag switches to JSON output for machine consumption
- Human-friendly output shows spinners, success/failure messages
- Events logged through `log()` function that branches on agent mode

## React Router v7 Support (v0.0.5)
- Added `'react-router'` to Framework type in `detect.ts`
- Detection checks for `react-router` package before Remix (RR7 uses different package name)
- CSS locations: `['app/app.css', 'app/root.css', 'app/styles.css', 'app/globals.css']`
- Component paths: `{ components: 'app/components/ui', primitives: 'app/lib/primitives' }`

## Config File System (v0.0.5)
- `rafters init` now creates `.rafters/config.rafters.json`
- Config stores: framework, componentsPath, primitivesPath, cssPath
- `rafters add` loads config and uses it for path transformations

## Path Transformation
```typescript
// In add.ts
function transformPath(registryPath: string, config: RaftersConfig | null): string {
  if (!config) return registryPath;
  if (registryPath.startsWith('components/ui/')) {
    return registryPath.replace('components/ui/', `${config.componentsPath}/`);
  }
  if (registryPath.startsWith('lib/primitives/')) {
    return registryPath.replace('lib/primitives/', `${config.primitivesPath}/`);
  }
  return registryPath;
}
```

## Import Transformation
- `transformFileContent()` now takes config parameter
- Transforms relative imports to use configured paths
- Handles primitives, components, lib, and hooks imports
- Derives lib path as parent of primitivesPath
- Derives hooks path from components path structure

## Testing
- Tests in `test/utils/detect.test.ts` cover RR7 detection
- Tests pass `null` as config parameter for backward compatibility
