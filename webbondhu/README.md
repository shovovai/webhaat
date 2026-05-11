# WebBondhu

WebBondhu is an AI-powered Bangladesh Business OS for multi-tenant websites, ecommerce, bookings, subscriptions, Bangladeshi payments, and business operations.

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Workspaces

- `apps/web` — customer app and business dashboard
- `apps/api` — Express API and realtime server
- `apps/admin` — super-admin panel
- `packages/ui` — shared UI primitives
- `packages/config` — environment and design configuration
- `packages/types` — shared TypeScript contracts
- `packages/ai` — AI orchestration layer
- `packages/database` — Mongoose models and database connection

## Verification

```bash
node scripts/verify-structure.mjs
pnpm typecheck
```
