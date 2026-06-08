# Skeinventory Domain Model

## Purpose

This document defines the core domain model for Skeinventory MVP. It is intended
to keep business logic deterministic, type-safe, and testable across inventory
CRUD, quantity handling, search/filtering, and persistence.

## Modeling Principles

- Domain logic lives outside presentation components.
- Stored values are source-of-truth; derived values are computed.
- Quantities and totals must never be negative.
- Validation happens at boundaries before persistence.
- Filter and sorting behavior must be stable and deterministic.

## Core Types

```ts
export type UUID = string;
export type ISODateString = string;

export type WeightCategory =
	| "lace"
	| "fingering"
	| "sport"
	| "dk"
	| "worsted"
	| "aran"
	| "bulky";

export type SortDirection = "asc" | "desc";

export interface ImageRef {
	id: UUID;
	url: string;
	alt?: string;
	mimeType?: string;
	width?: number;
	height?: number;
}

export interface Yarn {
	id: UUID;
	maker: string;
	yarnName: string;
	materialType: string;
	weightCategory: WeightCategory;

	handDyed: boolean;
	superwash: boolean;

	quantityInStock: number;

	totalYardage?: number;
	totalMeters?: number;
	totalGrams?: number;

	perSkeinYardage?: number;
	perSkeinMeters?: number;
	perSkeinGrams?: number;

	image?: ImageRef;
	archived: boolean;

	createdAt: ISODateString;
	updatedAt: ISODateString;
}
```

## Yarn Invariants

Required field invariants:

- `id` is unique across all records.
- `maker`, `yarnName`, and `materialType` are non-empty trimmed strings.
- `weightCategory` is one of the allowed categories.
- `handDyed`, `superwash`, and `archived` are explicit booleans.

Numeric invariants:

- `quantityInStock >= 0` and supports decimals.
- `totalYardage`, `totalMeters`, `totalGrams` are optional but, when present,
	must be `>= 0`.
- `perSkeinYardage`, `perSkeinMeters`, `perSkeinGrams` are optional but, when
	present, must be `>= 0`.

Temporal invariants:

- `createdAt` is immutable after creation.
- `updatedAt` changes on every successful mutation.

## Inventory Calculations

Inventory calculations convert between per-skein and total measurements when
sufficient inputs are available.

```ts
export interface CalculationInputs {
	quantityInStock: number;

	totalYardage?: number;
	totalMeters?: number;
	totalGrams?: number;

	perSkeinYardage?: number;
	perSkeinMeters?: number;
	perSkeinGrams?: number;

	// Tracks which total fields were manually edited by user and should be
	// preserved as source-of-truth.
	manualTotalOverrides?: Partial<Record<"yardage" | "meters" | "grams", true>>;
}

export interface CalculationResult {
	totalYardage?: number;
	totalMeters?: number;
	totalGrams?: number;
	perSkeinYardage?: number;
	perSkeinMeters?: number;
	perSkeinGrams?: number;
}
```

Calculation rules:

1. If a total is manually edited, that total is preserved.
2. If no manual override exists for a total and matching per-skein value exists,
	 compute: `total = perSkein * quantityInStock`.
3. If total exists and `quantityInStock > 0`, derive per-skein as:
	 `perSkein = total / quantityInStock` when needed.
4. Never derive values from invalid inputs (negative or non-finite numbers).
5. When `quantityInStock = 0`, totals may still be stored manually, but per-skein
	 values are not derived by division.
6. Precision strategy should be explicit (for example fixed decimal rounding at
	 display boundary only, not destructive rounding in storage).

## Filter Criteria

```ts
export interface FilterCriteria {
	searchText?: string;
	maker?: string[];
	materialType?: string[];
	weightCategory?: WeightCategory[];

	handDyed?: boolean | "any";
	superwash?: boolean | "any";
	archived?: boolean | "any";
}

export type SortField =
	| "maker"
	| "yarnName"
	| "materialType"
	| "weightCategory"
	| "quantityInStock"
	| "updatedAt";

export interface SortCriteria {
	field: SortField;
	direction: SortDirection;
}
```

Filtering semantics:

- All active filters are combined with AND logic.
- Multi-select values within a single field are combined with OR logic.
- Text search matches normalized strings across: maker, yarnName, materialType,
	and weightCategory.
- Default list behavior excludes archived records unless explicitly requested.
- Clear filters resets to default active inventory view.

## Application State Model

```ts
export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface ValidationError {
	field: string;
	message: string;
}

export interface UserMessage {
	kind: "success" | "error" | "info";
	text: string;
}

export interface InventoryState {
	records: Yarn[];
	selectedRecordId?: UUID;

	filters: FilterCriteria;
	sort: SortCriteria;

	loadStatus: AsyncStatus;
	saveStatus: AsyncStatus;
	deleteStatus: AsyncStatus;

	validationErrors: ValidationError[];
	message?: UserMessage;

	// Tracks user overrides for totals per record.
	manualTotalOverridesByRecord: Record<UUID, Partial<Record<"yardage" | "meters" | "grams", true>>>;
}

export interface PersistenceEnvelope {
	schemaVersion: number;
	lastSavedAt: ISODateString;
	data: InventoryState;
}
```

## Domain Operations

```ts
export interface DomainService {
	create(input: Omit<Yarn, "id" | "createdAt" | "updatedAt">): Yarn;
	update(id: UUID, patch: Partial<Omit<Yarn, "id" | "createdAt">>): Yarn;
	archive(id: UUID): Yarn;
	restore(id: UUID): Yarn;
	remove(id: UUID): { id: UUID };

	updateQuantity(id: UUID, quantityInStock: number): Yarn;

	validate(yarn: Yarn): ValidationError[];
	applyFilters(records: Yarn[], filters: FilterCriteria): Yarn[];
	applySort(records: Yarn[], sort: SortCriteria): Yarn[];
	calculate(inputs: CalculationInputs): CalculationResult;
}
```

Operation guarantees:

- `create`, `update`, and `updateQuantity` fail fast on validation errors.
- `archive` and `restore` are idempotent.
- `remove` requires explicit confirmation at UX boundary before invocation.
- `applySort` must be stable when compared fields are equal.
- Persistence errors return recoverable error states and never silently drop
	in-memory data.

## Validation Model

Validation should return structured field-level errors suitable for form display.

```ts
export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
}
```

Baseline validation cases:

- Missing required strings (`maker`, `yarnName`, `materialType`).
- Unknown `weightCategory`.
- Negative quantity or totals.
- Non-finite numeric values.
- Optional image with malformed `url`.

## Persistence Model

Repository boundary:

```ts
export interface InventoryRepository {
	load(): Promise<PersistenceEnvelope>;
	save(state: InventoryState): Promise<void>;
}
```

Persistence rules:

- Treat external storage as untrusted input.
- Validate and migrate by `schemaVersion` before use.
- On load failure, return a safe empty state + user-facing recovery message.
- On save failure, keep in-memory state and surface explicit retry guidance.

## Recommended Test Coverage

- Model validation for required/optional fields.
- Decimal quantity acceptance and negative value rejection.
- Calculation precedence for manual totals vs derived totals.
- Filter determinism across combined criteria.
- Stable sorting behavior.
- Archive/restore transitions.
- Persistence load/save success and failure paths.

## Open Extension Points

- Unit normalization strategy (yardage/meters conversion policy).
- Expanded material taxonomy (controlled vocabulary vs free text).
- Image metadata enrichment.
- Schema migration plan for post-MVP fields.
