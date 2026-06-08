import { useState } from 'react'
import type {
  CreateYarnDraft,
  CreateYarnFieldError,
  Yarn,
  YarnEditorMode,
} from '../types/yarn'
import { DEFAULT_CREATE_YARN_DRAFT } from '../types/yarn'
import { createDraftFromYarn } from '../services/yarnFactory'
import { hasFieldErrors, validateYarnDraft } from '../services/yarnValidation'

interface SubmitCallbacks {
  onCreate: (draft: CreateYarnDraft) => Promise<boolean>
  onEdit: (id: string, draft: CreateYarnDraft) => Promise<boolean>
}

interface UseYarnEditorResult {
  isOpen: boolean
  mode: YarnEditorMode
  selectedRecordId: string | null
  draft: CreateYarnDraft
  fieldErrors: CreateYarnFieldError
  submitError: string | null
  openCreate: () => void
  openEdit: (record: Yarn) => void
  close: () => void
  updateDraft: (patch: Partial<CreateYarnDraft>) => void
  submit: (callbacks: SubmitCallbacks) => Promise<boolean>
}

export const useYarnEditor = (): UseYarnEditorResult => {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<YarnEditorMode>('create')
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [draft, setDraft] = useState<CreateYarnDraft>(DEFAULT_CREATE_YARN_DRAFT)
  const [fieldErrors, setFieldErrors] = useState<CreateYarnFieldError>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const openCreate = (): void => {
    setMode('create')
    setSelectedRecordId(null)
    setDraft(DEFAULT_CREATE_YARN_DRAFT)
    setFieldErrors({})
    setSubmitError(null)
    setIsOpen(true)
  }

  const openEdit = (record: Yarn): void => {
    setMode('edit')
    setSelectedRecordId(record.id)
    setDraft(createDraftFromYarn(record))
    setFieldErrors({})
    setSubmitError(null)
    setIsOpen(true)
  }

  const close = (): void => {
    setIsOpen(false)
    setMode('create')
    setSelectedRecordId(null)
    setDraft(DEFAULT_CREATE_YARN_DRAFT)
    setFieldErrors({})
    setSubmitError(null)
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

  const submit = async ({
    onCreate,
    onEdit,
  }: SubmitCallbacks): Promise<boolean> => {
    const errors = validateYarnDraft(draft)

    if (hasFieldErrors(errors)) {
      setFieldErrors(errors)
      setSubmitError('Please fix the highlighted fields before saving.')
      return false
    }

    const isSuccess =
      mode === 'create'
        ? await onCreate(draft)
        : selectedRecordId
          ? await onEdit(selectedRecordId, draft)
          : false

    if (isSuccess) {
      close()
      return true
    }

    setSubmitError('Saving failed. Please try again.')
    return false
  }

  return {
    isOpen,
    mode,
    selectedRecordId,
    draft,
    fieldErrors,
    submitError,
    openCreate,
    openEdit,
    close,
    updateDraft,
    submit,
  }
}
