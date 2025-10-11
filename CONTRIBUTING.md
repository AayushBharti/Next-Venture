# Contributing to VentureDen

Thanks for your interest in contributing! Here's how to get started.

## Setup

1. Fork and clone the repo
2. Install dependencies: `pnpm install`
3. Copy env files: `cp apps/web/.env.example apps/web/.env.local` (same for `apps/studio` and `packages/sanity`)
4. Start dev servers: `pnpm dev`

## Development

- **Web app**: `pnpm dev:web` (localhost:3000)
- **Sanity Studio**: `pnpm dev:studio` (localhost:3333)
- **Lint**: `pnpm lint`
- **Format**: `pnpm format`
- **Type check**: `pnpm check-types`

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Ensure `pnpm lint` and `pnpm check-types` pass
4. Commit with a clear message
5. Open a PR against `main`

## Guidelines

- Follow existing code patterns and conventions
- Use Biome for formatting (not Prettier/ESLint)
- Keep PRs focused on a single change
- Update types after schema changes: `cd apps/studio && pnpm type`

## Questions?

Open an issue or reach out to the maintainer.
