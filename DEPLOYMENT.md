# Deployment Guide

This monorepo uses [Changesets](https://github.com/changesets/changesets) for automated versioning and publishing to npm.

## How It Works

### 1. Development Workflow

When making changes that should be released:

1. **Make your changes** as normal
2. **Add a changeset** by running:
   ```bash
   pnpm changeset
   ```
3. **Follow the prompts** to:
   - Select which packages changed
   - Choose the type of change (major, minor, patch)
   - Write a summary of the changes
4. **Commit the changeset file** that gets created in `.changeset/`

### 2. Release Process

When PRs are merged to `main`:

1. **GitHub Actions runs CI** to ensure tests pass
2. **Changesets creates a "Version Packages" PR** that:
   - Updates package.json versions
   - Generates CHANGELOGs
   - Removes consumed changeset files
3. **When the Version Packages PR is merged**:
   - Packages are automatically built and published to npm
   - Git tags are created for each released version
   - GitHub releases are created

## Monorepo Tagging Strategy

Tags follow the pattern: `@scope/package@version`

Examples:
- `@rafters/cli@1.2.3` - CLI version 1.2.3
- `@rafters/ui@2.1.0` - UI components version 2.1.0
- `@rafters/shared@1.0.5` - Shared utilities version 1.0.5

This allows each package to have independent versioning and releases.

## Published Packages

The following packages are published to npm:

- **`@rafters/cli`** - CLI tool for installing components
- **`@rafters/ui`** - React component library
- **`@rafters/shared`** - Shared utilities and types
- **`@rafters/color-utils`** - Color manipulation utilities
- **`@rafters/design-tokens`** - Design token definitions

### Ignored Packages

- **`@rafters/studio`** - Development-only app (configured in `.changeset/config.json`)

## Setup Requirements

### GitHub Secrets

Add these secrets to your GitHub repository:

1. **`NPM_TOKEN`** - npm access token with publish permissions
   - Create at: https://www.npmjs.com/settings/tokens
   - Choose "Automation" token type
   - Scope to your organization if using scoped packages

### Package Configuration

Each publishable package must have:

```json
{
  "name": "@rafters/package-name",
  "version": "0.1.0",
  "private": false,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "...",
    "prepublishOnly": "pnpm build"
  }
}
```

## Commands

### Development
```bash
# Add a changeset for your changes
pnpm changeset

# Check changeset status
pnpm changeset:check

# Preview what will be released
changeset status --verbose
```

### Manual Release (if needed)
```bash
# Bump versions and update changelogs
pnpm changeset:version

# Build and publish packages
pnpm changeset:publish
```

## Changeset Types

- **patch** (0.0.1) - Bug fixes, small changes
- **minor** (0.1.0) - New features, backwards compatible
- **major** (1.0.0) - Breaking changes

## Example Changeset

```markdown
---
"@rafters/cli": minor
"@rafters/ui": patch
---

Add new button variant and fix CLI registry connection

- Added success variant to Button component
- Fixed registry timeout issue in CLI
- Updated documentation
```

## Troubleshooting

### Failed Publish
- Check NPM_TOKEN is valid and has publish permissions
- Ensure package names are available on npm
- Verify build succeeds locally

### Missing Changesets Warning
- Add a changeset if your PR includes changes that should trigger a release
- Ignore the warning if changes are internal/documentation only

### Version Conflicts
- Pull latest `main` before creating changesets
- Resolve conflicts in the "Version Packages" PR if needed

## References

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Publishing with GitHub Actions](https://github.com/changesets/action)
- [Monorepo Best Practices](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)