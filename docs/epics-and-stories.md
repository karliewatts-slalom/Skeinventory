# Skeinventory MVP Epics

## Purpose

This document organizes the Skeinventory MVP into implementation epics that support incremental delivery. Each epic represents a logical phase of development and is aligned to the project constitution and product requirements.

## Delivery Principles

- Ship usable slices early rather than waiting for the full product.
- Protect inventory correctness, accessibility, and persistence in every phase.
- Keep each epic independently testable and reviewable.
- Build foundations first, then layer on richer inventory workflows.

## Epic 1: Application Foundation and Inventory Model

### Objective

Establish the technical and domain foundation required to build the rest of the MVP safely.

### Outcome

The application can represent yarn inventory records correctly, enforce core types and validation rules, and persist basic inventory state.

### Scope

- Set up the React + TypeScript application structure around components, hooks, services, types, and utilities.
- Define explicit domain interfaces for yarn inventory records.
- Implement validation for required fields, non-negative totals, and decimal skein quantities.
- Implement persistence for inventory data across reloads.
- Add test infrastructure for business logic and persistence behavior.

### Supports

- FR-1 Yarn Inventory Tracking
- FR-6 Quantity Management
- FR-7 Inventory Calculation Rules
- FR-8 Persistence and Data Reliability
- NFR-2 Maintainability
- NFR-3 Type Safety
- NFR-4 Testing

### Related User Stories

- US-1 Create a Yarn Inventory Record
- US-3 Add Measurement and Weight Data
- US-7 Update Quantity in Stock
- US-13 Persist Data Across Restarts

### Exit Criteria

- Inventory records can be created in the data layer with valid typed models.
- Persistence survives reloads without silent data loss.
- Validation prevents impossible inventory states.
- Business logic and persistence tests are in place.

### Implementation Stories

1. E1-S1 Domain model and type contracts
Deliver value: establish reliable, explicit yarn record interfaces so all features share consistent data shapes.
Estimate: Medium - Requires careful domain modeling and refactoring touchpoints across features, but limited UI complexity.
Acceptance criteria:
- Given the codebase is compiled in strict TypeScript mode,
  When domain model types are implemented,
  Then all inventory features consume shared interfaces without type errors.
- Given a new inventory field is added,
  When the domain interface is updated,
  Then compile-time checks highlight all required implementation updates.

2. E1-S2 Inventory repository with persistence
Deliver value: users can retain inventory data across app reloads using a stable persistence adapter.
Estimate: Medium - Involves persistence abstraction, error handling, and integration with app state lifecycle.
Acceptance criteria:
- Given a user saves one or more inventory records,
  When the application is reloaded,
  Then previously saved records are restored from persistence.
- Given persistence storage is unavailable or throws an error,
  When a save is attempted,
  Then the repository returns a recoverable error state without corrupting in-memory data.

3. E1-S3 Validation rules for inventory inputs
Deliver value: invalid states (negative totals, malformed required fields) are blocked before save.
Estimate: Small - Mostly straightforward rule definitions and validation wiring at save boundaries.
Acceptance criteria:
- Given a user enters invalid required values,
  When validation runs before save,
  Then the save is rejected with field-specific validation errors.
- Given a user enters valid required values,
  When validation runs,
  Then the record passes validation and can be persisted.

4. E1-S4 Decimal and partial skein support in core model
Deliver value: users can represent realistic stash quantities including partial skeins.
Estimate: Small - Focused data-type and validation adjustments with limited surface area.
Acceptance criteria:
- Given quantity values include decimals,
  When a record is created or updated,
  Then the model accepts and persists decimal values without rounding loss.
- Given a partial skein value such as 0.5,
  When calculations or validations run,
  Then the value is treated as valid and remains non-negative.

5. E1-S5 Foundation test harness for domain and persistence
Deliver value: core inventory rules and persistence behavior are regression-protected from the start.
Estimate: Medium - Requires test framework setup decisions and baseline fixtures for reusable coverage.
Acceptance criteria:
- Given domain validation and persistence modules exist,
  When automated tests run,
  Then unit tests cover success and failure paths for both modules.
- Given a regression is introduced in validation or persistence behavior,
  When the test suite is executed,
  Then the failing behavior is detected before release.

## Epic 2: Core Inventory CRUD Experience

### Objective

Deliver the first end-to-end usable inventory workflow for creating, viewing, editing, and deleting yarn records.

### Outcome

Users can manage their stash records directly in the UI with clear validation and dependable feedback.

### Scope

- Build inventory list and detail/edit views.
- Implement create and edit flows for all MVP yarn attributes.
- Support optional image attachment metadata in record creation/editing.
- Implement safe deletion with confirmation.
- Show explicit loading, success, empty, and error states.

### Supports

- FR-1 Yarn Inventory Tracking
- FR-5 Record Deletion
- FR-9 Core UX States
- NFR-1 Accessibility
- NFR-6 Reliability and Correctness

### Related User Stories

- US-1 Create a Yarn Inventory Record
- US-2 Add Core Yarn Details
- US-4 Track Hand Dyed and Superwash
- US-5 Add an Optional Image
- US-6 Edit Existing Records
- US-10 Delete a Record Safely
- US-14 Show Clear UX States

### Exit Criteria

- Users can create, view, edit, and delete records through the UI.
- Form validation is actionable and accessible.
- Core CRUD states are keyboard accessible.
- Failed actions surface clear recovery guidance.

### Implementation Stories

1. E2-S1 Inventory list page with empty/loading states
Deliver value: users can open the app and understand whether they have stash data or need to add records.
Estimate: Medium - Includes list rendering, async state handling, and UX states that must be accessible.
Acceptance criteria:
- Given inventory data is loading,
  When the inventory page first renders,
  Then a loading state is shown until data is resolved.
- Given no records exist,
  When loading completes,
  Then an empty-state message and clear next action are shown.

2. E2-S2 Create yarn record form
Deliver value: users can add new stash entries with required and optional MVP fields.
Estimate: Large - High field count, validation behavior, and submit flow integration make this a broad story.
Acceptance criteria:
- Given a user completes required fields with valid values,
  When the create form is submitted,
  Then a new inventory record is persisted and appears in the list.
- Given a user omits required fields,
  When the form is submitted,
  Then inline validation errors are shown and no record is created.

3. E2-S3 Edit yarn record flow
Deliver value: users can correct or update existing inventory details without recreating entries.
Estimate: Medium - Reuses create patterns but adds data loading, prefill, and safe update semantics.
Acceptance criteria:
- Given an existing inventory record,
  When a user edits fields and saves,
  Then updated values replace previous values and persist after reload.
- Given a save operation fails,
  When the user submits edits,
  Then an error message is shown and existing saved data remains unchanged.

4. E2-S4 Delete record with confirmation
Deliver value: users can remove incorrect records safely and intentionally.
Estimate: Small - Clear single interaction with confirmation and persistence update.
Acceptance criteria:
- Given a user chooses to delete a record,
  When confirmation is accepted,
  Then the record is removed from inventory and persistence.
- Given a user cancels the delete confirmation,
  When the dialog closes,
  Then the record remains unchanged.

5. E2-S5 Save feedback and error handling states
Deliver value: users receive immediate success/error feedback and know how to recover from failures.
Estimate: Medium - Cross-cutting UX behavior touching multiple actions and async outcomes.
Acceptance criteria:
- Given a create or edit action succeeds,
  When the request completes,
  Then a success message is announced and displayed.
- Given a create or edit action fails,
  When the request completes,
  Then a clear error state and recovery guidance are presented.

## Epic 3: Inventory Calculation and Quantity Accuracy

### Objective

Make yarn quantity handling trustworthy for real stash usage, including partial skeins and editable totals.

### Outcome

Users can manage full and partial skeins with clear calculation behavior and consistent total values.

### Scope

- Support full and partial skein quantities.
- Allow per-skein measurements to remain optional.
- Allow total yardage, meters, and grams to be edited directly.
- Recalculate related totals when sufficient inputs are available.
- Preserve manually edited totals as the source of truth.
- Add regression coverage for edge cases around recalculation and decimal quantities.

### Supports

- FR-6 Quantity Management
- FR-7 Inventory Calculation Rules
- NFR-4 Testing
- NFR-6 Reliability and Correctness

### Related User Stories

- US-3 Add Measurement and Weight Data
- US-7 Update Quantity in Stock

### Exit Criteria

- Decimal skein quantities are fully supported.
- Manual total edits behave predictably and do not corrupt related values.
- Calculation edge cases are covered by automated tests.
- Quantity updates remain consistent after save and reload.

### Implementation Stories

1. E3-S1 Quantity editor with decimal support
Deliver value: users can enter realistic in-stock quantities for full or partial skeins.
Estimate: Small - Focused input behavior and validation for a single field family.
Acceptance criteria:
- Given a user enters a decimal quantity,
  When quantity is saved,
  Then the exact decimal value is persisted and displayed.
- Given a user enters a negative quantity,
  When validation runs,
  Then save is blocked and a validation message is shown.

2. E3-S2 Editable total yardage/meters/grams inputs
Deliver value: users can directly correct total measurement values when needed.
Estimate: Medium - Multiple linked fields with validation and save semantics increase implementation scope.
Acceptance criteria:
- Given a user edits total yardage, meters, or grams,
  When the form is submitted with valid values,
  Then the edited totals are saved to the record.
- Given a user leaves per-skein measurements blank,
  When totals are edited,
  Then totals can still be saved successfully.

3. E3-S3 Recalculation engine for related totals
Deliver value: when enough information is present, related totals auto-update to reduce manual math.
Estimate: Large - Non-trivial business rules and dependency logic with edge-case handling.
Acceptance criteria:
- Given sufficient related inputs are available,
  When a user changes one measurement,
  Then dependent totals recalculate automatically.
- Given insufficient inputs are available,
  When recalculation is attempted,
  Then unchanged totals remain stable and no invalid value is produced.

4. E3-S4 Manual-total source-of-truth rule
Deliver value: users keep control over totals after direct edits, preventing unexpected overrides.
Estimate: Medium - Requires clear precedence rules and state management to avoid unintended recalculation.
Acceptance criteria:
- Given a user manually edits a total field,
  When the record is saved,
  Then the manual total is preserved as the source-of-truth value.
- Given later calculations run with partial data,
  When no explicit user override is made,
  Then source-of-truth totals are not silently replaced.

5. E3-S5 Calculation regression test suite
Deliver value: edge cases (rounding, partial skeins, missing per-skein inputs) stay stable over time.
Estimate: Medium - Significant scenario matrix design, though mostly test-focused and low UI impact.
Acceptance criteria:
- Given calculation rules are implemented,
  When automated tests run,
  Then tests cover decimals, partial skeins, optional per-skein values, and recalculation boundaries.
- Given a change introduces incorrect calculation behavior,
  When the test suite executes,
  Then the regression is detected by failing tests.

## Epic 4: Search, Filter, and Inventory Organization

### Objective

Help users quickly find and organize yarn across active and archived inventory.

### Outcome

Users can search, filter, archive, and restore yarn records without losing historical context.

### Scope

- Implement text search across key inventory fields.
- Implement combinable filters for archived status, maker, material type, hand dyed, superwash, and weight category.
- Implement archive and restore workflows.
- Ensure sorting/filtering behavior remains deterministic and stable.
- Add tests for filter combinations, empty states, and archived views.

### Supports

- FR-2 Inventory Search
- FR-3 Inventory Filtering
- FR-4 Archive Management
- NFR-4 Testing
- NFR-5 Performance
- NFR-6 Reliability and Correctness

### Related User Stories

- US-8 Archive Records
- US-9 Restore Archived Records
- US-11 Search Inventory
- US-12 Filter Inventory

### Exit Criteria

- Users can find records quickly through search and filters.
- Archived records are separated from the default active view and can be restored.
- Filter/search states are predictable and covered by tests.
- Empty results are communicated clearly.

### Implementation Stories

1. E4-S1 Text search across key yarn fields
Deliver value: users can quickly locate specific yarn by maker, name, or material details.
Estimate: Medium - Involves indexing/filter logic and UI responsiveness expectations.
Acceptance criteria:
- Given inventory records contain searchable fields,
  When a user enters a search term,
  Then matching records are shown and non-matching records are hidden.
- Given no records match the term,
  When search is applied,
  Then an empty-results message is shown.

2. E4-S2 Archived-state toggle and segmented views
Deliver value: users can focus on active stash while still accessing archived history.
Estimate: Small - Clear view-state segmentation with moderate UI wiring.
Acceptance criteria:
- Given the default inventory view,
  When the page loads,
  Then active records are shown and archived records are excluded.
- Given a user switches to archived view,
  When the toggle is applied,
  Then archived records are shown in a dedicated view.

3. E4-S3 Multi-filter panel for inventory attributes
Deliver value: users can narrow inventory to exactly the yarn characteristics needed for decisions.
Estimate: Large - Multiple combinable filters plus state synchronization and usability concerns.
Acceptance criteria:
- Given multiple filters are selected,
  When filters are applied,
  Then only records matching all selected criteria are shown.
- Given filters are active,
  When clear filters is selected,
  Then the default unfiltered result set is restored.

4. E4-S4 Archive and restore actions from list/detail views
Deliver value: users can manage stash organization without deleting records.
Estimate: Medium - Requires consistent state transitions across multiple interaction surfaces.
Acceptance criteria:
- Given an active record,
  When archive is triggered from list or detail view,
  Then the record status becomes archived and it leaves the active list.
- Given an archived record,
  When restore is triggered,
  Then the record status becomes active and it appears in the active list.

5. E4-S5 Search/filter determinism and empty-state tests
Deliver value: users get predictable results and clear feedback when no matches exist.
Estimate: Medium - Broad test coverage needed across combined search and filter conditions.
Acceptance criteria:
- Given the same dataset and same search/filter inputs,
  When results are requested repeatedly,
  Then the ordering and contents remain deterministic.
- Given search/filter test scenarios run in CI,
  When behavior changes unexpectedly,
  Then automated tests fail and surface the regression.

## Epic 5: Accessibility, Quality Hardening, and MVP Release Readiness

### Objective

Bring the MVP to release quality by closing accessibility, usability, and regression gaps across all flows.

### Outcome

The MVP is stable, keyboard accessible, well tested, and ready for first release.

### Scope

- Audit all primary workflows for semantic HTML, labels, focus visibility, and keyboard navigation.
- Add screen reader-friendly status messaging for dynamic actions.
- Harden error handling and recovery for persistence and save failures.
- Complete regression coverage for critical business logic, filters, sorting behavior, and persistence.
- Validate MVP exit criteria from the PRD.

### Supports

- Constitution accessibility and testing principles
- FR-8 Persistence and Data Reliability
- FR-9 Core UX States
- NFR-1 Accessibility
- NFR-4 Testing
- NFR-6 Reliability and Correctness

### Related User Stories

- US-13 Persist Data Across Restarts
- US-14 Show Clear UX States
- US-15 Support Keyboard-Only Workflows

### Exit Criteria

- Primary workflows are fully keyboard accessible.
- Dynamic success and error states are announced clearly.
- Critical workflows are covered by automated tests.
- MVP success criteria can be demonstrated end to end.

### Implementation Stories

1. E5-S1 Keyboard navigation audit and fixes
Deliver value: keyboard-only users can complete all primary inventory workflows independently.
Estimate: Large - Cross-application audit and iterative fixes across many components.
Acceptance criteria:
- Given a keyboard-only user,
  When navigating create, edit, delete, archive, search, and filter flows,
  Then all actions are reachable and operable without a mouse.
- Given focus moves through interactive controls,
  When tabbing forward and backward,
  Then focus order is logical and focus indicators remain visible.

2. E5-S2 Semantic labels and form accessibility pass
Deliver value: assistive technology users can understand controls and input expectations.
Estimate: Medium - Broad but mostly systematic updates to markup and labeling patterns.
Acceptance criteria:
- Given form controls on primary workflows,
  When inspected with accessibility tooling,
  Then each control has an associated label and accessible name.
- Given semantic structures are reviewed,
  When pages are audited,
  Then native HTML semantics are used where possible and ARIA is only used when needed.

3. E5-S3 Screen-reader announcements for dynamic states
Deliver value: save, delete, archive, and error outcomes are perceivable without visual cues.
Estimate: Medium - Requires robust live-region strategy and integration with async state changes.
Acceptance criteria:
- Given a dynamic action succeeds,
  When state changes are committed,
  Then success messages are announced through an appropriate live region.
- Given a dynamic action fails,
  When errors are returned,
  Then error messages are announced and include actionable recovery guidance.

4. E5-S4 End-to-end MVP regression suite
Deliver value: core user journeys remain reliable through release and future changes.
Estimate: Large - Significant setup, test authoring, and stabilization effort across critical workflows.
Acceptance criteria:
- Given MVP-critical user journeys are defined,
  When end-to-end tests run,
  Then create/edit/delete/archive/search/filter and persistence flows are covered.
- Given a core journey breaks,
  When CI executes end-to-end tests,
  Then the pipeline fails with actionable test output.

5. E5-S5 Release readiness checklist against PRD and constitution
Deliver value: MVP launch decisions are evidence-based and aligned to non-negotiable quality principles.
Estimate: Small - Primarily documentation and review workflow definition with limited engineering complexity.
Acceptance criteria:
- Given MVP scope and constitution principles,
  When release readiness is reviewed,
  Then each required PRD and constitution criterion is marked pass, risk, or blocked.
- Given open high-severity gaps remain,
  When the release decision is evaluated,
  Then launch is blocked until mitigations are approved.

## Suggested Delivery Order

1. Epic 1: Application Foundation and Inventory Model
2. Epic 2: Core Inventory CRUD Experience
3. Epic 3: Inventory Calculation and Quantity Accuracy
4. Epic 4: Search, Filter, and Inventory Organization
5. Epic 5: Accessibility, Quality Hardening, and MVP Release Readiness

## Notes

- This sequence is intended to maximize early usability while protecting data integrity.
- Epics 2 through 4 can overlap once Epic 1 establishes the core model and persistence boundaries.
- Deferred roadmap items from the PRD remain out of scope for these MVP epics.
