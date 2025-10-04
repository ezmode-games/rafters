# Test Fixture Projects

This directory contains static fixture projects used for CLI integration tests.

## Fixtures

- `nextjs-app-tw/` - Next.js App Router with Tailwind v4
- `vite-react-tw/` - Vite + React with Tailwind v4
- `react-router-tw/` - React Router v7 with Tailwind v4
- `astro-tw/` - Astro + React with Tailwind v4

## Generating Fixtures

Fixtures are generated **once** and committed to the repo. To regenerate:

```bash
pnpm test:generate-fixtures
```

**Note**: This takes ~5-10 minutes. Only regenerate if:
- Upgrading framework versions
- Changing Tailwind config
- Fixture is corrupted

## Usage

Tests copy these fixtures to `/tmp/rafters-cli-tests/` for isolation.
Each test gets a fresh copy (excluding `node_modules`).
