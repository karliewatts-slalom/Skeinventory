import { describe, expect, it } from 'vitest'
import type { Yarn } from '../types/yarn'
import { filterInventory } from './inventorySearch'

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
    weightCategory: 'dk',
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
]

describe('filterInventory', () => {
  it('returns full dataset when query is empty', () => {
    expect(filterInventory(records, '   ')).toEqual(records)
  })

  it('matches case-insensitively', () => {
    const result = filterInventory(records, 'mALa')

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('1')
  })

  it('matches partial strings', () => {
    const result = filterInventory(records, 'super')

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('2')
  })

  it('matches across maker, yarnName, materialType, and weightCategory', () => {
    expect(filterInventory(records, 'malabrigo')).toHaveLength(1)
    expect(filterInventory(records, 'rios')).toHaveLength(1)
    expect(filterInventory(records, 'merino')).toHaveLength(1)
    expect(filterInventory(records, 'dk')).toHaveLength(1)
  })
})
