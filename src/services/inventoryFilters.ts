import type { WeightCategory, Yarn } from '../types/yarn'

export type ToggleFilterValue = 'yes' | 'no' | 'any'

export interface InventoryAttributeFilters {
  weightCategories: WeightCategory[]
  maker: string
  handDyed: ToggleFilterValue
  superwash: ToggleFilterValue
}

export const DEFAULT_INVENTORY_ATTRIBUTE_FILTERS: InventoryAttributeFilters = {
  weightCategories: [],
  maker: '',
  handDyed: 'any',
  superwash: 'any',
}

export const filterByAttributes = (
  records: Yarn[],
  filters: InventoryAttributeFilters
): Yarn[] => {
  return records.filter((record) => {
    if (
      filters.weightCategories.length > 0 &&
      !filters.weightCategories.includes(record.weightCategory)
    ) {
      return false
    }

    if (filters.maker && record.maker !== filters.maker) {
      return false
    }

    if (filters.handDyed === 'yes' && !record.handDyed) {
      return false
    }

    if (filters.handDyed === 'no' && record.handDyed) {
      return false
    }

    if (filters.superwash === 'yes' && !record.superwash) {
      return false
    }

    if (filters.superwash === 'no' && record.superwash) {
      return false
    }

    return true
  })
}
