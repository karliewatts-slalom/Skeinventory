# GitHub Copilot Instructions for Skeinventory

Skeinventory is a React + TypeScript application for knitters and crocheters to manage yarn stash inventory. Prioritize clarity, reliability, accessibility, and maintainability over cleverness.

## Product Context

- Users track yarn in stash, including brand, fiber, weight, yardage, colorway, quantity, and lot/dye info.
- Users search, filter, sort, and update stash entries quickly.
- Data correctness is critical: inventory counts and yarn details must remain consistent.
- UX should feel calm and practical for frequent day-to-day use.

## Architecture Guidelines

- Use a folder structure that clearly separates concerns:
  - `components/`
  - `hooks/`
  - `services/`
  - `types/`
  - `utils/`
- Keep UI concerns, domain logic, and data access separate.
- Prefer React function components and hooks.
- Avoid business rules inside presentational components.
- Build small, composable modules rather than large multipurpose files.
- Keep side effects isolated in dedicated hooks/services.

If a file does not exist yet, follow this structure when generating new code.

## Code Organization and Conventions

- Keep files focused on one responsibility.
- Use named exports by default; use default exports only when there is a clear project convention.
- Co-locate tests with implementation (`*.test.ts`, `*.test.tsx`) unless a shared test area is more appropriate.
- Prefer pure functions for transformation and validation logic.
- Keep React components lean:
  - View and interaction in component.
  - Data fetching/state orchestration in hooks.
  - Business rules in domain/service modules.
- Avoid deeply nested component trees and prop drilling; use composition and context carefully.
- Document non-obvious decisions with short, meaningful comments.

## React Best Practices

- Use strict, predictable state flows.
- Derive state when possible instead of duplicating it.
- Use memoization (`useMemo`, `useCallback`, `React.memo`) only when there is measurable value.
- Treat forms as first-class UX:
  - Validate user input clearly.
  - Show helpful inline errors.
  - Preserve partially entered data when reasonable.
- Handle loading, empty, error, and success states explicitly for all async views.

## Accessibility Requirements (Non-Negotiable)

- Meet WCAG 2.1 AA expectations where practical.
- Use semantic HTML first (`button`, `label`, `fieldset`, `table`, etc.).
- Ensure full keyboard navigation for all actions.
- Maintain visible focus indicators.
- Provide accessible names for controls and icon-only buttons.
- Ensure labels are associated with all form controls.
- Use ARIA only when native semantics are insufficient.
- Ensure color contrast is sufficient for text and UI controls.
- Announce dynamic status updates when needed (for example save success/errors).
- Do not rely on color alone to communicate meaning.

## Testing Expectations

- Write tests for all new business logic and bug fixes.
- Include tests for filtering behavior and edge cases.
- Include persistence tests for storage and data-retrieval flows.
- Minimum coverage expectations:
  - Unit tests for business logic, pure functions, formatters, validators, reducers/selectors.
  - Component tests for user-visible behavior and interactions.
  - Integration tests for key flows (for example add yarn, edit quantity, filter stash, and persisted reload state).
- Prefer behavior-driven assertions over implementation details.
- Avoid brittle snapshots for complex interactive components.
- Mock network boundaries, not internal logic.
- Include regression tests for previously fixed defects.
- Keep test data realistic for yarn inventory scenarios.

## Styling Conventions

- Use a consistent styling approach across the project (CSS Modules, styled-components, or other established project standard).
- Prefer design tokens for color, spacing, typography, radius, and elevation.
- Keep styles scalable and reusable; avoid one-off inline style objects except for truly dynamic values.
- Use mobile-first responsive design.
- Support common breakpoints without layout breakage.
- Preserve readability and hierarchy for dense inventory data.
- Use clear visual affordances for interactive elements and actionable states.

## TypeScript Best Practices

- Enable and respect strict TypeScript settings.
- Do not use `any` types.
- Enforce strict typing throughout the codebase.
- Model domain data with explicit interfaces.
- Use discriminated unions for state machines and async states.
- Keep function signatures explicit for public APIs.
- Prefer immutable updates and readonly types where practical.
- Parse/validate external data at boundaries (API/local storage) before use in UI.
- Represent nullable/optional fields intentionally; do not blur `undefined` and `null` semantics.

## Data and Domain Modeling Guidance

When generating models for yarn inventory, include fields as applicable:

- `id`
- `name`
- `brand`
- `fiberContent`
- `yarnWeight`
- `yardage`
- `skeinWeight`
- `colorway`
- `dyeLot`
- `quantity`
- `purchaseDate`
- `notes`
- `location`

Guidance:

- Normalize units and naming conventions.
- Validate numeric values (non-negative, sensible ranges).
- Keep sorting/filtering deterministic and stable.

## Performance and Reliability

- Prevent unnecessary re-renders in large inventory lists.
- Use list virtualization for very large datasets when needed.
- Debounce expensive search/filter inputs.
- Ensure updates are resilient to transient failures.
- Show clear recovery options for failed actions.

## Copilot Output Expectations

When generating code for Skeinventory:

- Produce complete, runnable snippets aligned to existing project patterns.
- Prefer incremental, review-friendly changes over large rewrites.
- Include tests alongside new logic/components whenever practical.
- Include accessibility considerations in every UI change.
- Keep naming domain-specific and meaningful to knit/crochet inventory.
- If assumptions are required, state them briefly in comments or PR notes.

## Do Not

- Do not introduce breaking architectural patterns without explicit request.
- Do not mix unrelated concerns in the same module.
- Do not add dependencies without clear justification.
- Do not disable linting/type checks to make code pass.
- Do not ship UI work without keyboard and screen-reader considerations.
