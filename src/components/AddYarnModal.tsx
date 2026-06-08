import { type FormEvent, useEffect, useMemo, useRef } from 'react'
import type {
  CreateYarnDraft,
  CreateYarnFieldError,
  WeightCategory,
} from '../types/yarn'

const WEIGHT_OPTIONS: WeightCategory[] = [
  'lace',
  'fingering',
  'sport',
  'dk',
  'worsted',
  'aran',
  'bulky',
]

interface AddYarnModalProps {
  draft: CreateYarnDraft
  fieldErrors: CreateYarnFieldError
  submitError: string | null
  onDraftChange: (patch: Partial<CreateYarnDraft>) => void
  onCancel: () => void
  onSubmit: () => Promise<boolean>
}

const formatWeightOption = (value: WeightCategory): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

export const AddYarnModal = ({
  draft,
  fieldErrors,
  submitError,
  onDraftChange,
  onCancel,
  onSubmit,
}: AddYarnModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusable.length === 0) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!first || !last) {
        return
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [onCancel])

  const imageHint = useMemo(() => {
    if (draft.imageUrl.trim().length > 0) {
      return draft.imageUrl
    }

    return 'Click to upload image\\nPNG, JPG up to 10MB'
  }, [draft.imageUrl])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <div className="modal-overlay" role="presentation">
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-yarn-heading"
        ref={dialogRef}
      >
        <header className="modal-header">
          <h2 id="add-yarn-heading">Add New Skeinventory</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Close add yarn dialog"
          >
            ×
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <section className="input-group">
            <label htmlFor="imageUrl">Image (optional)</label>
            <input
              id="imageUrl"
              value={draft.imageUrl}
              onChange={(event) =>
                onDraftChange({ imageUrl: event.target.value })
              }
              placeholder="https://example.com/yarn.jpg"
              aria-invalid={fieldErrors.imageUrl ? 'true' : 'false'}
              aria-describedby={
                fieldErrors.imageUrl ? 'imageUrl-error' : undefined
              }
            />
            <div className="upload-box" aria-hidden="true">
              {imageHint.split('\\n').map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {fieldErrors.imageUrl && (
              <p id="imageUrl-error" className="field-error" role="alert">
                {fieldErrors.imageUrl}
              </p>
            )}
          </section>

          <section className="grid-two">
            <div className="input-group">
              <label htmlFor="maker">Maker *</label>
              <input
                id="maker"
                ref={firstInputRef}
                value={draft.maker}
                onChange={(event) =>
                  onDraftChange({ maker: event.target.value })
                }
                aria-invalid={fieldErrors.maker ? 'true' : 'false'}
                aria-describedby={fieldErrors.maker ? 'maker-error' : undefined}
              />
              {fieldErrors.maker && (
                <p id="maker-error" className="field-error" role="alert">
                  {fieldErrors.maker}
                </p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="yarnName">Yarn Name *</label>
              <input
                id="yarnName"
                value={draft.yarnName}
                onChange={(event) =>
                  onDraftChange({ yarnName: event.target.value })
                }
                aria-invalid={fieldErrors.yarnName ? 'true' : 'false'}
                aria-describedby={
                  fieldErrors.yarnName ? 'yarnName-error' : undefined
                }
              />
              {fieldErrors.yarnName && (
                <p id="yarnName-error" className="field-error" role="alert">
                  {fieldErrors.yarnName}
                </p>
              )}
            </div>
          </section>

          <section className="grid-three">
            <div className="input-group">
              <label htmlFor="yardage">Yardage *</label>
              <input
                id="yardage"
                type="number"
                min="0"
                value={draft.yardage}
                onChange={(event) =>
                  onDraftChange({ yardage: event.target.value })
                }
                aria-invalid={fieldErrors.yardage ? 'true' : 'false'}
              />
              {fieldErrors.yardage && (
                <p className="field-error">{fieldErrors.yardage}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="meters">Meters *</label>
              <input
                id="meters"
                type="number"
                min="0"
                value={draft.meters}
                onChange={(event) =>
                  onDraftChange({ meters: event.target.value })
                }
                aria-invalid={fieldErrors.meters ? 'true' : 'false'}
              />
              {fieldErrors.meters && (
                <p className="field-error">{fieldErrors.meters}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="grams">Grams *</label>
              <input
                id="grams"
                type="number"
                min="0"
                value={draft.grams}
                onChange={(event) =>
                  onDraftChange({ grams: event.target.value })
                }
                aria-invalid={fieldErrors.grams ? 'true' : 'false'}
              />
              {fieldErrors.grams && (
                <p className="field-error">{fieldErrors.grams}</p>
              )}
            </div>
          </section>

          <section className="grid-two">
            <div className="input-group">
              <label htmlFor="weightCategory">Weight Category *</label>
              <select
                id="weightCategory"
                value={draft.weightCategory}
                onChange={(event) =>
                  onDraftChange({
                    weightCategory: event.target.value as WeightCategory,
                  })
                }
              >
                {WEIGHT_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {formatWeightOption(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="materialType">Material Type *</label>
              <input
                id="materialType"
                value={draft.materialType}
                onChange={(event) =>
                  onDraftChange({ materialType: event.target.value })
                }
                placeholder="e.g., Wool, Cotton, Blend"
                aria-invalid={fieldErrors.materialType ? 'true' : 'false'}
              />
              {fieldErrors.materialType && (
                <p className="field-error">{fieldErrors.materialType}</p>
              )}
            </div>
          </section>

          <section className="input-group">
            <label htmlFor="quantityInStock">Quantity in Stock *</label>
            <input
              id="quantityInStock"
              type="number"
              min="0"
              step="0.01"
              value={draft.quantityInStock}
              onChange={(event) =>
                onDraftChange({ quantityInStock: event.target.value })
              }
              aria-invalid={fieldErrors.quantityInStock ? 'true' : 'false'}
            />
            {fieldErrors.quantityInStock && (
              <p className="field-error">{fieldErrors.quantityInStock}</p>
            )}
          </section>

          <section className="checkbox-group" aria-label="Boolean properties">
            <label>
              <input
                type="checkbox"
                checked={draft.handDyed}
                onChange={(event) =>
                  onDraftChange({ handDyed: event.target.checked })
                }
              />
              <span>Hand Dyed</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={draft.superwash}
                onChange={(event) =>
                  onDraftChange({ superwash: event.target.checked })
                }
              />
              <span>Superwash</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={draft.archived}
                onChange={(event) =>
                  onDraftChange({ archived: event.target.checked })
                }
              />
              <span>Archived</span>
            </label>
          </section>

          {submitError && (
            <p className="submit-error" role="alert">
              {submitError}
            </p>
          )}

          <footer className="modal-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Skeinventory
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
