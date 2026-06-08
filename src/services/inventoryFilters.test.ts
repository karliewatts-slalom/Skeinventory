import { describe, expect, it } from 'vitest'
import type { Yarn } from '../types/yarn'
import {
  DEFAULT_INVENTORY_ATTRIBUTE_FILTERS,
  filterByAttributes,
} from './inventoryFilters'

const now = new Date().toISOString()

const records: Yarn[] = [
  {
    id: '1',
    maker: 'Malabrigo',
    yarnName: 'Rios',
    materialType: 'Merino Wool',
    weightCategory: 'worsted',
    handDyed: true,
    superwash: true,
    quantityInStock: 3,
    totalYardage: 210,
    totalMeters: 192,
    totalGrams: 100,
    archived: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    maker: 'Cascade',
    yarnName: '220 Superwash',
    materialType: 'Wool',
    weightCategory: 'worsted',
    handDyed: false,
    superwash: true,
    quantityInStock: 5,
    totalYardage: 220,
    totalMeters: 200,
    totalGrams: 100,
    archived: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    maker: 'Lion Brand',
    yarnName: 'Wool-Ease',
    materialType: 'Acrylic/Wool Blend',
    weightCategory: 'dk',
    handDyed: false,
    superwash: false,
    quantityInStock: 8,
    totalYardage: 197,
    totalMeters: 180,
    totalGrams: 85,
    archived: true,
    createdAt: now,
    updatedAt: now,
  },
]

describe('filterByAttributes', () => {
  it('returns full dataset when filters are default', () => {
    expect(filterByAttributes(records, DEFAULT_INVENTORY_ATTRIBUTE_FILTERS)).toEqual(
      records
    )
  })

  it('filters by selected weight categories', () => {
    const result = filterByAttributes(records, {
      ...DEFAULT_INVENTORY_ATTRIBUTE_FILTERS,
      weightCategories: ['dk'],
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('3')
  })

  it('filters by maker', () => {
    const result = filterByAttributes(records, {
      ...DEFAULT_INVENTORY_ATTRIBUTE_FILTERS,
      maker: 'Cascade',
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('2')
  })

  it('supports combinable AND filtering across attributes', () => {
    const result = filterByAttributes(records, {
      weightCategories: ['worsted'],
      maker: 'Malabrigo',
      handDyed: 'yes',
      superwash: 'yes',
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('1')
  })
})
