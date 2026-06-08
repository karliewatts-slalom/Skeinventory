import { AddYarnModal } from './AddYarnModal'
import { InventoryFilters } from './InventoryFilters'
import { YarnInventoryList } from './YarnInventoryList'
import { useYarnEditor } from '../hooks/useYarnEditor'
import { useYarnInventory } from '../hooks/useYarnInventory'

export const InventoryFeatureContainer = () => {
  const {
    records,
    statusMessage,
    operationError,
    isLoading,
    createRecordFromDraft,
    updateRecordFromDraft,
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
          <YarnInventoryList
            records={records}
            isLoading={isLoading}
            onEdit={openEdit}
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
