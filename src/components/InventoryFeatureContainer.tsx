import { AddYarnModal } from './AddYarnModal'
import { InventoryFilters } from './InventoryFilters'
import { YarnInventoryList } from './YarnInventoryList'
import { useYarnEditor } from '../hooks/useYarnEditor'
import { useYarnInventory } from '../hooks/useYarnInventory'
import { useState } from 'react'

type InventoryViewMode = 'active' | 'archived'

export const InventoryFeatureContainer = () => {
  const [viewMode, setViewMode] = useState<InventoryViewMode>('active')
  const {
    records,
    statusMessage,
    operationError,
    isLoading,
    createRecordFromDraft,
    updateRecordFromDraft,
    archiveRecord,
    restoreRecord,
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

  const visibleRecords = records.filter((record) =>
    viewMode === 'active' ? !record.archived : record.archived
  )

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Skeinventory</h1>
      </header>

      <div className="app-body">
        <InventoryFilters />

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
            isLoading={isLoading}
            onEdit={openEdit}
            onArchive={(recordId) => {
              void archiveRecord(recordId)
            }}
            onRestore={(recordId) => {
              void restoreRecord(recordId)
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
