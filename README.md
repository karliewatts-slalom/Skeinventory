# Skeinventory

Skeinventory is a yarn stash management app for knitters and crocheters.

## US-0 Foundation

This repository now includes a React + TypeScript foundation for MVP delivery,
with strict typing, test tooling, linting, formatting, and a domain-first source
layout.

### Architecture

- UI layer: React components focused on rendering and interaction
- State orchestration: hooks for feature flow and async state
- Domain and data: services and pure calculation utilities
- Type contracts: explicit interfaces and unions in the type layer
- Persistence boundary: repository abstraction for storage adapters

### Folder Structure

- `src/components`: UI components
- `src/hooks`: orchestration hooks
- `src/services`: domain and data-access services
- `src/types`: domain model and shared contracts
- `src/calculations`: inventory math and conversion logic
- `src/utils`: shared pure helpers
- `src/test`: shared test setup

### Technology Choices

- React 19 + TypeScript + Vite
- Vitest + React Testing Library + jsdom for tests
- ESLint for static analysis
- Prettier for formatting

Playwright is intentionally excluded from initial scope.

## Development Commands

- `npm run dev`: run development server
- `npm run build`: production build
- `npm run preview`: preview production build
- `npm run typecheck`: strict TypeScript checks
- `npm run lint`: ESLint checks
- `npm run format`: format codebase with Prettier
- `npm run format:check`: verify formatting
- `npm run test`: run tests once
- `npm run test:watch`: run tests in watch mode
- `npm run test:coverage`: run tests with coverage
