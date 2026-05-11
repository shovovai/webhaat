# WebBondhu Architecture

WebBondhu is a Turborepo-based MERN SaaS platform for Bangladesh SMEs. The repository is split into deployable applications and shared packages so product modules can evolve independently while preserving tenant isolation and common contracts.

## Applications

- `apps/web`: Bangla-first customer web app and business dashboard built with Next.js App Router.
- `apps/admin`: super-admin control plane for users, subscriptions, categories, templates, prompts, gateways, domains, analytics, support, modules, pricing, and feature flags.
- `apps/api`: Express API with layered controllers, services, DTO validation, tenant middleware, security middleware, MongoDB, Redis-ready workers, Socket.IO, and structured logging.

## Packages

- `packages/types`: shared enums, DTO helpers, pagination contracts, tenant context types.
- `packages/config`: environment validation and design tokens.
- `packages/database`: Mongoose connection and schemas with timestamps, indexes, relations, validation, and soft-delete support.
- `packages/ai`: provider-agnostic AI orchestration contracts and website blueprint pipeline.
- `packages/ui`: reusable accessible UI primitives styled for the dark WebBondhu design system.

## Tenancy and data boundaries

Every business-owned collection stores `businessId` and indexes it. API routes that operate on business data must resolve the active business from authenticated membership and enforce role/permission checks before repository access.

## Security baseline

The API applies request IDs, structured request logging, Helmet/CSP, CORS allow-listing, rate limiting, compression, JSON body limits, secure cookies, DTO validation, centralized error handling, password hashing, JWT access/refresh token issuance, and tenant context checks.

## Payment architecture

Payment gateways implement a common adapter interface. Admin configuration enables bKash, Nagad, Rocket, or SSLCommerz independently in sandbox or live mode. Webhooks are verified per adapter and stored on payment records for auditability.

## AI architecture

The AI package exposes orchestration pipelines rather than binding the domain to one provider. Onboarding answers are validated, sent to an OpenAI-compatible client, and returned as typed website blueprints containing template hints, pages, sections, SEO, and module suggestions.
