import type { CreateYarnDraft, CreateYarnFieldError } from '../types/yarn'

const hasText = (value: string): boolean => value.trim().length > 0

const parseNonNegativeNumber = (value: string): number | null => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null
  }

  return parsed
}

export const validateCreateYarnDraft = (
  draft: CreateYarnDraft
): CreateYarnFieldError => {
  const errors: CreateYarnFieldError = {}

  if (!hasText(draft.maker)) {
    errors.maker = 'Maker is required.'
  }

  if (!hasText(draft.yarnName)) {
    errors.yarnName = 'Yarn name is required.'
  }

  if (!hasText(draft.materialType)) {
    errors.materialType = 'Material type is required.'
  }

  if (!hasText(draft.weightCategory)) {
    errors.weightCategory = 'Weight category is required.'
  }

  if (parseNonNegativeNumber(draft.yardage) === null) {
    errors.yardage = 'Yardage must be a non-negative number.'
  }

  if (parseNonNegativeNumber(draft.meters) === null) {
    errors.meters = 'Meters must be a non-negative number.'
  }

  if (parseNonNegativeNumber(draft.grams) === null) {
    errors.grams = 'Grams must be a non-negative number.'
  }

  if (parseNonNegativeNumber(draft.quantityInStock) === null) {
    errors.quantityInStock = 'Quantity must be a non-negative number.'
  }

  if (hasText(draft.imageUrl)) {
    try {
      // Validate shape only; image retrieval happens at render boundary.
      new URL(draft.imageUrl)
    } catch {
      errors.imageUrl = 'Image URL must be a valid URL.'
    }
  }

  return errors
}

export const hasFieldErrors = (errors: CreateYarnFieldError): boolean =>
  Object.keys(errors).length > 0
