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
- The system must support decimal skein quantities.
- Quantity changes must be persisted and reflected immediately in the UI.
- The system should provide clear error feedback if quantity persistence fails.

### FR-7: Inventory Calculation Rules

- Users may store full or partial skeins.
- Per-skein measurements are optional.
- Total inventory measurements are editable.
- Editing a total measurement recalculates related totals when enough information exists.
- Total values are considered the source of truth after manual edits.

### FR-8: Persistence and Data Reliability

- Inventory changes must persist across application restarts.
- The system must prevent silent data loss during normal user flows.
- On persistence failures, the user must receive clear recovery guidance.

### FR-9: Core UX States

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

## MVP User Stories and Acceptance Criteria

### US-1: Create a Yarn Inventory Record

As a knitter or crocheter,
I want to create a yarn inventory record,
so that I can keep a reliable stash log from the start.

Given I am on the inventory page,
When I submit a new yarn record with all required fields valid,
Then the record is saved and appears in the active inventory list.

Given I enter invalid required data,
When I submit the form,
Then I see field-level validation errors and the record is not saved.

### US-2: Add Core Yarn Details

As a knitter or crocheter,
I want to add details like maker, yarn name, and material type,
so that I can identify yarn quickly when planning projects.

Given I am creating or editing a yarn record,
When I enter maker, yarn name, and material type and save,
Then those values are persisted and displayed in the record details and list views.

### US-3: Add Measurement and Weight Data

As a knitter or crocheter,
I want to include yardage, meters, grams, and weight category,
so that I can choose the right yarn for pattern requirements.

Given I am creating or editing a yarn record,
When I enter numeric length and weight values plus a valid weight category,
Then the values are saved and shown correctly on reload.

Given I enter negative numbers,
When I attempt to save,
Then the system blocks save and shows validation feedback.

### US-4: Track Hand Dyed and Superwash

As a knitter or crocheter,
I want to mark whether yarn is hand dyed and superwash,
so that I can make informed decisions about care and substitutions.

Given I am editing a yarn record,
When I toggle hand dyed or superwash status and save,
Then the boolean values are persisted and visible in the record.

### US-5: Add an Optional Image

As a knitter or crocheter,
I want to optionally attach an image to a yarn record,
so that I can visually confirm color and texture at a glance.

Given I am creating or editing a yarn record,
When I add an image and save,
Then the image is associated with that record and displayed in its details.

Given I do not add an image,
When I save the record,
Then the record is still saved successfully.

### US-6: Edit Existing Records

As a knitter or crocheter,
I want to edit existing yarn records,
so that my stash data stays accurate as details change.

Given an existing yarn record,
When I update one or more fields and save,
Then the latest values replace the previous values in the inventory.

Given save fails,
When I submit my edits,
Then I receive a clear error and no silent partial update occurs.

### US-7: Update Quantity in Stock

As a knitter or crocheter,
I want to update quantity in stock with validation,
so that I always know how much usable yarn I have left.

Given an existing yarn record,
When I change quantity in stock to a non-negative value and save,
Then the new quantity is persisted and immediately reflected in the UI.

Given I enter a negative quantity,
When I attempt to save,
Then save is blocked and a validation message is shown.

### US-8: Archive Records

As a knitter or crocheter,
I want to archive yarn records I am not actively using,
so that my active stash view stays clean without losing history.

Given an active yarn record,
When I choose archive,
Then the record is marked archived and removed from the default active list.

### US-9: Restore Archived Records

As a knitter or crocheter,
I want to restore archived yarn records,
so that I can return yarn to active inventory when needed.

Given an archived yarn record,
When I choose restore,
Then the record is marked active and reappears in the active inventory list.

### US-10: Delete a Record Safely

As a knitter or crocheter,
I want to delete a yarn record with confirmation,
so that I can remove incorrect or unwanted entries safely.

Given an existing yarn record,
When I choose delete,
Then I must confirm deletion before the record is removed.

Given I cancel confirmation,
When the dialog closes,
Then the record remains unchanged.

### US-11: Search Inventory

As a knitter or crocheter,
I want to search my inventory by fields like maker, yarn name, and material type,
so that I can find yarn quickly during project planning.

Given multiple yarn records exist,
When I search using maker, yarn name, or material text,
Then matching records are shown and non-matching records are excluded.

Given no records match,
When search is applied,
Then an empty-state message is shown.

### US-12: Filter Inventory

As a knitter or crocheter,
I want to filter inventory by attributes like weight category, hand dyed, superwash, and archived status,
so that I can narrow the stash to yarn that matches my current needs.

Given inventory records with varied attributes,
When I apply filters for weight category, hand dyed, superwash, maker, or archived status,
Then only records matching all selected filters are shown.

Given filters are active,
When I clear filters,
Then the full default list view is restored.

### US-13: Persist Data Across Restarts

As a knitter or crocheter,
I want inventory changes to persist across app restarts,
so that I can trust that my stash data is not lost.

Given I create or edit records,
When I close and reopen the application,
Then all saved inventory data remains available and accurate.

### US-14: Show Clear UX States

As a knitter or crocheter,
I want clear loading, empty, success, and error states,
so that I always understand what the app is doing and what to do next.

Given I perform an async action such as save or fetch,
When the action is in progress,
Then a loading state is displayed.

Given the action succeeds or fails,
When it completes,
Then I see a clear success or error message and next-step guidance.

### US-15: Support Keyboard-Only Workflows

As a keyboard-only user,
I want to complete create, edit, archive, delete, search, and filter actions without a mouse,
so that the app is fully accessible in daily use.

Given I use only keyboard input,
When I navigate create, edit, archive, delete, search, and filter actions,
Then I can complete each flow without a mouse.

Given focus moves through interactive elements,
When I tab or shift-tab,
Then focus indicators remain visible and form controls have associated labels.

## Assumptions

1. Initial release focuses on single-user inventory management.
2. Persistence may begin with local storage or a simple backend and evolve over time.
3. Product scope prioritizes core stash workflows before advanced features.
