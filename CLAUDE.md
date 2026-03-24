# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

vanilla-extract is a zero-runtime CSS-in-TypeScript library. It's a pnpm monorepo with 18+ packages spanning the core CSS API, atomic CSS utilities (sprinkles), multi-variant recipes, and build-tool integrations (Vite, Webpack, esbuild, Next.js, Rollup, Parcel).

## Common Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start preconstruct dev mode (sets up package entry points, doesn't work with webpack fixtures)
pnpm build                # Full build (preconstruct + dts generation)
pnpm test:unit            # Run all unit tests (vitest)
pnpm test:unit -- --reporter verbose  # Verbose test output
pnpm test:unit -- tests/sprinkles     # Run tests in a specific directory
pnpm test:playwright      # Run E2E tests (builds Next.js fixtures first, needs Chromium)
pnpm lint                 # Run all linters (manypkg, prettier, tsc, oxlint)
pnpm format               # Auto-fix lint/format issues (oxlint --fix + prettier --write)
```

## Architecture

### Package Dependency Layers

1. **Core layer:** `@vanilla-extract/css` is the foundational package. `@vanilla-extract/private` holds shared internals.
2. **Feature layer:** `recipes` and `sprinkles` peer-depend on `css`. `dynamic` provides runtime theming.
3. **Integration layer:** `@vanilla-extract/integration` contains shared compiler logic (Babel, esbuild-based evaluation). All build plugins depend on this.
4. **Plugin layer:** `vite-plugin`, `webpack-plugin`, `esbuild-plugin`, `next-plugin`, `rollup-plugin`, `parcel-transformer`, `jest-transform`. These adapt the integration layer for each build tool.
5. **Compiler:** `@vanilla-extract/compiler` wraps integration + vite-node for standalone compilation.

### Key Patterns

- **Multi-entry packages:** Many packages expose multiple entry points via preconstruct config (e.g., `@vanilla-extract/css` has `recipe`, `adapter`, `transformCss`, `fileScope`, etc.).
- **Workspace protocol:** Local package references use `workspace:*` in package.json.
- **Browser overrides:** Some packages use the `browser` field in package.json for browser-specific builds.

### Build System

- **Preconstruct** handles bundling and dev-mode package linking. Run `pnpm dev` after install to set up entry point proxies.
- **TypeScript** config targets ES2022 with `module: "Preserve"` and `moduleResolution: "bundler"`. `noEmit: true` — tsc is for type-checking only.
- **Vitest** for unit tests, **Playwright** for E2E tests.
- **oxlint** + **Prettier** for linting/formatting (single quotes, trailing commas).

### Test Structure

- Unit tests live in `/tests/` subdirectories (e.g., `tests/sprinkles/`, `tests/compiler/`, `tests/recipes/`).
- E2E tests use `**/*.playwright.ts` pattern with snapshots in `tests/e2e/snapshots/`.
- Test fixtures (full app setups) are in `/fixtures/` — various Next.js versions, Vite, themed configs, etc.
- Shared test helpers are in `/test-helpers/`.

### Release Process

Uses **changesets** for versioning and changelogs. PRs should include a changeset (`pnpm changeset`) when making user-facing changes.
