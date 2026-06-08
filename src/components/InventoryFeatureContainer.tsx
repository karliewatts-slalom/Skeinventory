import { AddYarnModal } from './AddYarnModal'
import { InventoryFilters } from './InventoryFilters'
import { YarnInventoryList } from './YarnInventoryList'
import { useYarnInventory } from '../hooks/useYarnInventory'

export const InventoryFeatureContainer = () => {
  const {
    records,
    isModalOpen,
    draft,
    fieldErrors,
    submitError,
    statusMessage,
    isLoading,
    openModal,
    closeModal,
    updateDraft,
    submitDraft,
  } = useYarnInventory()

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Skeinventory</h1>
      </header>

      <div className="app-body">
        <InventoryFilters />

        <main className="inventory-area">
          {statusMessage && (
            <p className="status-message" role="status" aria-live="polite">
              {statusMessage}
            </p>
          )}
          <YarnInventoryList records={records} isLoading={isLoading} />
        </main>
      </div>

      <button type="button" className="floating-add-button" onClick={openModal}>
        + Add New Skeinventory
      </button>

      {isModalOpen && (
        <AddYarnModal
          draft={draft}
          fieldErrors={fieldErrors}
          submitError={submitError}
          onDraftChange={updateDraft}
          onCancel={closeModal}
          onSubmit={submitDraft}
        />
      )}
    </div>
  )
}