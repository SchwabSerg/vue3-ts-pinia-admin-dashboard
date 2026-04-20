## Live Demo

[vue3-ts-pinia-admin-dashboard.vercel.app](https://vue3-ts-pinia-admin-dashboard.vercel.app)

Login with any email and password: `password`

# Order Dashboard

[![CI](https://github.com/your-org/order-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/order-dashboard/actions/workflows/ci.yml)

Production-style Vue 3 admin dashboard for order and customer management, built with a modular architecture and development-grade mock infrastructure.

## Architecture

This project follows a layered frontend architecture with DDD-inspired feature modules and a lightweight hexagonal approach.

- Domain layer holds business types and pure helpers.
- API layer acts as repository-style adapters around HTTP.
- Store layer coordinates UI state and application workflows.
- Shared layer contains reusable UI, utilities, composables, and app-wide infrastructure.

## Tech Stack

- Vue 3
- TypeScript
- Pinia
- Vue Router
- MSW
- Vite

## Project Structure

- `src/app` — application bootstrap, router, providers, and environment config
- `src/shared` — reusable UI components, composables, stores, constants, and utilities
- `src/modules/auth` — authentication domain, API, store, components, and views
- `src/modules/orders` — order domain logic, state management, list/detail UI, and API access
- `src/modules/customers` — customer detail feature, related orders, and API access
- `src/mocks` — MSW browser worker, handlers, and seeded development data

## Getting Started

```bash
npm install
npm run dev
```

Create a local env file from the example before starting development:

```bash
cp .env.local.example .env.local
```

## Environment Files

- `.env.local.example` — example template for local development values
- `.env.production.example` — example template for production build values
- `.env.local` — real local file for your machine, not committed to git

Only example env files are committed. Real env files are kept out of git and should be provided locally or via hosting platform environment variables.

## Architectural Decisions

- Feature modules keep domain code, API access, state, and UI close together instead of spreading concerns by file type only.
- Repository-style API modules isolate fetch details from stores and views.
- MSW is used as a first-class local backend substitute so feature development is decoupled from real API availability.
- Pure domain helpers are kept free of Vue and Pinia imports so business rules remain testable and portable.
