import { useEffect, useState } from 'react'
import type { CreateYarnDraft, CreateYarnFieldError, Yarn } from '../types/yarn'
import { DEFAULT_CREATE_YARN_DRAFT } from '../types/yarn'
import { createYarnFromDraft } from '../services/yarnFactory'
import {
  hasFieldErrors,
  validateCreateYarnDraft,
} from '../services/yarnValidation'
import {
  localStorageInventoryRepository,
  type InventoryRepository,
} from '../services/inventoryRepository'
import { sampleInventoryRecords } from '../services/seedData'

interface UseYarnInventoryResult {
  records: Yarn[]
  isModalOpen: boolean
  draft: CreateYarnDraft
  fieldErrors: CreateYarnFieldError
  submitError: string | null
  statusMessage: string | null
  isLoading: boolean
  openModal: () => void
  closeModal: () => void
  updateDraft: (patch: Partial<CreateYarnDraft>) => void
  submitDraft: () => Promise<boolean>
}

export const useYarnInventory = (
  repository: InventoryRepository = localStorageInventoryRepository
): UseYarnInventoryResult => {
  const [records, setRecords] = useState<Yarn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draft, setDraft] = useState<CreateYarnDraft>(DEFAULT_CREATE_YARN_DRAFT)
  const [fieldErrors, setFieldErrors] = useState<CreateYarnFieldError>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async (): Promise<void> => {
      try {
        const loaded = await repository.load()

        if (!isMounted) {
          return
        }

        setRecords(loaded.length > 0 ? loaded : sampleInventoryRecords)
      } catch {
        if (!isMounted) {
          return
        }

        setRecords(sampleInventoryRecords)
        setSubmitError(
          'We could not load saved inventory. Showing sample data.'
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [repository])

  const openModal = (): void => {
    setSubmitError(null)
    setStatusMessage(null)
    setIsModalOpen(true)
  }

  const closeModal = (): void => {
    setIsModalOpen(false)
    setFieldErrors({})
    setSubmitError(null)
    setDraft(DEFAULT_CREATE_YARN_DRAFT)
  }

  const updateDraft = (patch: Partial<CreateYarnDraft>): void => {
    setDraft((current) => ({ ...current, ...patch }))
    setFieldErrors((current) => {
      const next = { ...current }

      Object.keys(patch).forEach((key) => {
        delete next[key as keyof CreateYarnFieldError]
      })

      return next
    })
  }

  const submitDraft = async (): Promise<boolean> => {
    const validationErrors = validateCreateYarnDraft(draft)

    if (hasFieldErrors(validationErrors)) {
      setFieldErrors(validationErrors)
      setSubmitError('Please fix the highlighted fields before saving.')
      return false
    }

    const nextRecord = createYarnFromDraft(draft)
    const nextRecords = [nextRecord, ...records]

    try {
      await repository.save(nextRecords)
      setRecords(nextRecords)
      setStatusMessage('Yarn record added successfully.')
      closeModal()
      return true
    } catch {
      setSubmitError('Saving failed. Please try again.')
      return false
    }
  }

  return {
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
  }
}
