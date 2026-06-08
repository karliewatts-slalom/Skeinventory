export type ManualOverrideKey = 'yardage' | 'meters' | 'grams'

export interface CalculationInputs {
  quantityInStock: number
  totalYardage?: number
  totalMeters?: number
  totalGrams?: number
  perSkeinYardage?: number
  perSkeinMeters?: number
  perSkeinGrams?: number
  manualTotalOverrides?: Partial<Record<ManualOverrideKey, true>>
}

export interface CalculationResult {
  totalYardage?: number
  totalMeters?: number
  totalGrams?: number
}

const isValidNumber = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

export const calculateTotals = (
  inputs: CalculationInputs
): CalculationResult => {
  const { quantityInStock, manualTotalOverrides } = inputs

  const result: CalculationResult = {
    totalYardage: inputs.totalYardage,
    totalMeters: inputs.totalMeters,
    totalGrams: inputs.totalGrams,
  }

  if (!isValidNumber(quantityInStock)) {
    return result
  }

  if (!manualTotalOverrides?.yardage && isValidNumber(inputs.perSkeinYardage)) {
    result.totalYardage = inputs.perSkeinYardage * quantityInStock
  }

  if (!manualTotalOverrides?.meters && isValidNumber(inputs.perSkeinMeters)) {
    result.totalMeters = inputs.perSkeinMeters * quantityInStock
  }

  if (!manualTotalOverrides?.grams && isValidNumber(inputs.perSkeinGrams)) {
    result.totalGrams = inputs.perSkeinGrams * quantityInStock
  }

  return result
}
