# Skeinventory Project Constitution

## Purpose

Skeinventory exists to help knitters and crocheters track yarn stash inventory accurately, quickly, and confidently. This constitution defines non-negotiable engineering and product principles for all contributions.

## Scope

This constitution applies to:

- Product decisions
- Feature design
- Code implementation
- Testing strategy
- Refactoring and maintenance
- Release and regression decisions

## Guiding Principles

### 1. Accessibility First

- All user-facing experiences must be keyboard accessible.
- Semantic HTML is the default; ARIA is used only when native semantics are insufficient.
- Every form control must have an associated label and accessible name.
- Focus states must be visible and never removed without an accessible replacement.
- Color alone must not communicate critical state or meaning.

Definition of done for accessibility:

- Keyboard-only users can complete the primary workflow.
- Screen reader labels and announcements are present for dynamic actions.
- New UI changes maintain acceptable contrast and interaction clarity.

### 2. Maintainability Over Cleverness

- Prefer simple, readable solutions over clever abstractions.
- Separate concerns across components, hooks, services, types, and utilities.
- Keep modules focused on one responsibility.
- Avoid hidden coupling and excessive indirection.
- Document non-obvious decisions with short, meaningful comments.

Definition of done for maintainability:

- A new contributor can understand changed code quickly.
- Logic is testable without tightly coupling UI and data layers.
- Refactors can be performed with predictable impact.

### 3. Calm, Practical User Experience

- Optimize for frequent, day-to-day use by makers managing real stash data.
- Prioritize clear flows for add, edit, search, filter, and quantity updates.
- Handle loading, empty, error, and success states explicitly.
- Use helpful validation and error messages that explain what to fix.
- Preserve user trust by preventing silent failures and ambiguous outcomes.

Definition of done for UX:

- Core tasks are fast and understandable.
- Feedback is immediate and clear after user actions.
- Edge cases are handled without breaking user flow.

### 4. Type Safety as a Quality Gate

- Strict TypeScript settings are required.
- `any` is not allowed in production code.
- Domain models use explicit interfaces.
- External data is validated or narrowed at boundaries before use.
- Nullability and optionality are intentional and explicit.

Definition of done for type safety:

- New code compiles under strict typing without bypasses.
- Public APIs and domain types are explicit and stable.
- Runtime data shape risks are handled at boundaries.

### 5. Testing Protects Behavior

- Every bug fix includes a regression test where practical.
- Business logic changes require unit tests.
- Filtering and sorting behavior requires explicit tests.
- Persistence behavior (save/load/update flows) requires tests.
- Tests should verify behavior, not implementation details.

Definition of done for testing:

- New behavior has test coverage proportional to risk.
- Existing critical flows remain green.
- Tests are deterministic and meaningful for future refactors.

### 6. Inventory Integrity is Non-Negotiable

- Quantity values must remain consistent, validated, and non-negative.
- Inventory operations must be deterministic and safe under repeated actions.
- Sorting and filtering must produce stable, predictable results.
- Edits must not silently discard or corrupt existing stash data.
- Data changes should be resilient to transient failures.

Definition of done for inventory behavior:

- No operation can produce impossible inventory states.
- State transitions are explicit and validated.
- Failed persistence paths surface clear recovery guidance.

## Decision Framework

When trade-offs are required, evaluate in this order:

1. Inventory integrity and correctness
2. Accessibility and usability
3. Maintainability and clarity
4. Type safety and reliability
5. Delivery speed

Speed is important, but never at the expense of correctness, accessibility, or data trust.

## Enforcement

- Pull requests should explain how changes satisfy relevant principles.
- Reviews should block changes that violate non-negotiable principles.
- Exceptions require explicit rationale, a documented mitigation, and a follow-up task.

## Amendment Process

This constitution can be amended when product or engineering needs evolve.

Amendments must:

- Include a clear rationale
- Describe expected impact
- Be approved by project maintainers

All amendments should preserve the core goal: trustworthy yarn inventory management for real users.
