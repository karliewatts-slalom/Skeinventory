# Skeinventory Product Requirements Document (PRD)

## Product Vision

Skeinventory is a practical and trustworthy yarn inventory management application for knitters and crocheters. It helps makers keep an accurate view of their yarn stash so they can plan projects, avoid overbuying, and confidently use what they already own.

The product should feel fast, calm, and reliable for everyday use, with a strong focus on data correctness and easy inventory workflows.

## Target Users

- Knitters who maintain small to very large yarn stashes
- Crocheters who need quick lookup of yarn details during project planning
- Makers who buy yarn over time and need a reliable record of quantity, weight, and colorway
- Users who want to organize active vs archived stash items without losing historical data

## Goals

1. Enable users to track yarn inventory records with complete yarn details and quantities.
2. Make search and filtering fast, accurate, and easy to use.
3. Support clear record lifecycle actions: create, edit, archive, delete, search, and filter.
4. Keep inventory quantity updates consistent and safe.
5. Deliver a dependable user experience with clear feedback and low friction.

## Non-Goals

1. Project pattern management or full project planning workflows.
2. Social features, messaging, or community sharing.
3. E-commerce purchasing integrations.
4. Advanced analytics or forecasting in the initial scope.
5. Multi-user collaboration in the initial scope.

## MVP Scope

### In Scope for MVP (First Release)

1. Create, view, edit, archive, and delete yarn inventory records.
2. Track required yarn attributes for each record:
	- optional image
	- maker
	- yarn name
	- hand dyed (boolean)
	- yardage
	- meters
	- grams
	- weight category (lace, fingering, sport, DK, worsted, aran, bulky)
	- material type
	- superwash status
	- quantity in stock
	- archived status
3. Search inventory records across key fields.
4. Filter inventory records by key attributes and archived status.
5. Quantity validation and updates with non-negative constraints.
6. Archive and restore workflows with clear active vs archived views.
7. Persistence of inventory data across application restarts.
8. Core UX states (loading, empty, success, error) and keyboard-accessible primary flows.

### Deferred to Future Versions

1. Project and pattern planning workflows.
2. Social/community features and sharing.
3. E-commerce and shopping integrations.
4. Advanced analytics, insights, and stash forecasting.
5. Multi-user collaboration and shared inventories.
6. Advanced media management for images (bulk upload, editing tools, cloud sync).
7. Automated yarn metadata enrichment from third-party catalogs.

### MVP Exit Criteria

1. Users can reliably complete create, edit, archive, delete, search, and filter flows.
2. Inventory quantities remain valid and consistent after updates and reloads.
3. Core workflows are usable with keyboard-only navigation.
4. Business logic, filter behavior, and persistence behavior are covered by automated tests.

## Functional Requirements

### FR-1: Yarn Inventory Tracking

- The system must allow users to create, view, edit, archive, and delete yarn inventory records.
- Each record should support these attributes:
	- id
	- optional image
	- maker
	- yarn name
	- hand dyed (boolean)
	- yardage
	- meters
	- grams
	- weight category (lace, fingering, sport, DK, worsted, aran, bulky)
	- material type
	- superwash status
	- quantity in stock
	- archived status
- Quantity in stock must support non-negative values only.

### FR-2: Inventory Search

- Users must be able to search yarn inventory records by relevant fields (for example maker, yarn name, material type, and weight category).
- Search results must update predictably and be easy to scan.
- Search must work for both active and archived contexts when selected.

### FR-3: Inventory Filtering

- Users must be able to filter inventory by key attributes, including archived status, hand dyed status, superwash status, weight category, material type, and maker.
- Multiple filters should be combinable.
- Filter behavior must be deterministic and stable.
- Users should be able to clear filters quickly.

### FR-4: Archive Management

- Users must be able to archive yarn records without deleting them.
- Archived entries must be excluded from default active inventory views.
- Users must be able to view archived entries and restore them to active status.

### FR-5: Record Deletion

- Users must be able to delete yarn inventory records.
- The system should require a confirmation step before deletion.
- Deletion outcomes must be clearly communicated to the user.

### FR-6: Quantity Management

- Users must be able to update quantity in stock for a yarn record.
- The system must prevent invalid quantity states (for example negative amounts).
- Quantity changes must be persisted and reflected immediately in the UI.
- The system should provide clear error feedback if quantity persistence fails.

### FR-7: Persistence and Data Reliability

- Inventory changes must persist across application restarts.
- The system must prevent silent data loss during normal user flows.
- On persistence failures, the user must receive clear recovery guidance.

### FR-8: Core UX States

- The system must present explicit loading, empty, success, and error states for async actions.
- Validation messages must be actionable and specific.
- Primary flows (create, edit, archive, delete, search, filter, quantity update) must be keyboard accessible.

## Non-Functional Requirements

### NFR-1: Accessibility

- UI must use semantic HTML where possible.
- All key actions must be fully operable by keyboard navigation.
- All form controls must have associated labels.
- Visual focus indicators must remain visible.
- The interface should meet WCAG 2.1 AA intent for contrast and interaction clarity.

### NFR-2: Maintainability

- Code must be organized with clear separation of concerns across components, hooks, services, types, and utilities.
- Business logic should remain outside presentation-focused UI components.
- Modules should stay focused and easy to reason about.
- Non-obvious implementation decisions should be documented briefly.

### NFR-3: Type Safety

- TypeScript strict mode must be enabled and respected.
- No any types in production code.
- Domain models must use explicit interfaces.
- External data must be validated or narrowed at boundaries.

### NFR-4: Testing

- Business logic must be covered by automated tests.
- Search and filter behavior must be covered by automated tests.
- Persistence behavior (save, load, update) must be covered by automated tests.
- Bug fixes should include regression tests where practical.

### NFR-5: Performance

- Search and filter interactions should feel responsive for typical stash sizes.
- Inventory list updates should avoid unnecessary re-renders.
- Performance should remain acceptable as stash size grows.

### NFR-6: Reliability and Correctness

- Inventory state transitions must be deterministic.
- Sorting and filtering outcomes must be stable.
- The system must not produce impossible inventory states.

## Success Criteria

1. Users can successfully create, edit, archive, delete, search, and filter yarn inventory records.
2. Quantity updates remain valid, persisted, and visible without inconsistency.
3. Core workflows are usable with keyboard-only navigation.
4. Critical inventory behaviors are covered by automated tests.
5. Users report confidence in stash accuracy and day-to-day usability.

## Assumptions

1. Initial release focuses on single-user inventory management.
2. Persistence may begin with local storage or a simple backend and evolve over time.
3. Product scope prioritizes core stash workflows before advanced features.
