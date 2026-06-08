import { AddYarnModal } from './AddYarnModal'
import { InventoryFilters } from './InventoryFilters'
import { YarnInventoryList } from './YarnInventoryList'
import { useYarnEditor } from '../hooks/useYarnEditor'
import { useYarnInventory } from '../hooks/useYarnInventory'
import { useState } from 'react'
import { filterInventory } from '../services/inventorySearch'
import {
  DEFAULT_INVENTORY_ATTRIBUTE_FILTERS,
  filterByAttributes,
} from '../services/inventoryFilters'
import type { WeightCategory } from '../types/yarn'

type InventoryViewMode = 'active' | 'archived'

export const InventoryFeatureContainer = () => {
  const [viewMode, setViewMode] = useState<InventoryViewMode>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [attributeFilters, setAttributeFilters] = useState(
    DEFAULT_INVENTORY_ATTRIBUTE_FILTERS
  )
  const {
    records,
    statusMessage,
    operationError,
    isLoading,
    createRecordFromDraft,
    updateRecordFromDraft,
    archiveRecord,
    restoreRecord,
    deleteRecord,
  } = useYarnInventory()
  const {
    isOpen,
    mode,
    draft,
    fieldErrors,
    submitError,
    openCreate,
    openEdit,
    close,
    updateDraft,
    submit,
  } = useYarnEditor()

  const viewFilteredRecords = records.filter((record) =>
    viewMode === 'active' ? !record.archived : record.archived
  )
  const searchFilteredRecords = filterInventory(viewFilteredRecords, searchQuery)
  const visibleRecords = filterByAttributes(
    searchFilteredRecords,
    attributeFilters
  )

  const makerOptions = Array.from(new Set(records.map((record) => record.maker))).sort(
    (left, right) => left.localeCompare(right)
  )

  const emptyStateVariant =
    records.length === 0
      ? 'no-records'
      : visibleRecords.length === 0
        ? 'no-results'
        : 'none'

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Skeinventory</h1>
      </header>

      <div className="app-body">
        <InventoryFilters
          filters={attributeFilters}
          makerOptions={makerOptions}
          onWeightCategoryToggle={(value: WeightCategory) => {
            setAttributeFilters((current) => {
              const hasValue = current.weightCategories.includes(value)

              return {
                ...current,
                weightCategories: hasValue
                  ? current.weightCategories.filter(
                      (category) => category !== value
                    )
                  : [...current.weightCategories, value],
              }
            })
          }}
          onMakerChange={(value) => {
            setAttributeFilters((current) => ({ ...current, maker: value }))
          }}
          onHandDyedChange={(value) => {
            setAttributeFilters((current) => ({ ...current, handDyed: value }))
          }}
          onSuperwashChange={(value) => {
            setAttributeFilters((current) => ({ ...current, superwash: value }))
          }}
          onClear={() => {
            setAttributeFilters(DEFAULT_INVENTORY_ATTRIBUTE_FILTERS)
          }}
        />

        <main className="inventory-area">
          {operationError && (
            <p className="submit-error" role="alert">
              {operationError}
            </p>
          )}
          {statusMessage && (
            <p className="status-message" role="status" aria-live="polite">
              {statusMessage}
            </p>
          )}
          <div className="search-row">
            <label htmlFor="inventory-search" className="search-label">
              Search inventory
            </label>
            <input
              id="inventory-search"
              type="search"
              className="search-input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search maker, yarn, material, or weight"
            />
          </div>
          <div className="view-toggle" role="group" aria-label="Inventory view">
            <button
              type="button"
              className={`pill ${viewMode === 'active' ? 'is-highlight' : ''}`}
              onClick={() => setViewMode('active')}
            >
              Active
            </button>
            <button
              type="button"
              className={`pill ${viewMode === 'archived' ? 'is-highlight' : ''}`}
              onClick={() => setViewMode('archived')}
            >
              Archived
            </button>
          </div>
          <YarnInventoryList
            records={visibleRecords}
            emptyStateVariant={emptyStateVariant}
            isLoading={isLoading}
            onEdit={openEdit}
            onArchive={(recordId) => {
              void archiveRecord(recordId)
            }}
            onRestore={(recordId) => {
              void restoreRecord(recordId)
            }}
            onDelete={(recordId) => {
              const shouldDelete = window.confirm(
                'Delete this yarn record? This action cannot be undone.'
              )

              if (!shouldDelete) {
                return
              }

              void deleteRecord(recordId)
            }}
          />
        </main>
      </div>

      <button
        type="button"
        className="floating-add-button"
        onClick={openCreate}
      >
        + Add New Skeinventory
      </button>

      {isOpen && (
        <AddYarnModal
          mode={mode}
          initialValues={draft}
          fieldErrors={fieldErrors}
          submitError={submitError}
          onDraftChange={updateDraft}
          onCancel={close}
          onSubmit={() =>
            submit({
              onCreate: createRecordFromDraft,
              onEdit: updateRecordFromDraft,
            })
          }
        />
      )}
    </div>
  )
}
