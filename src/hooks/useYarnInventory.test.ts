import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { InventoryRepository } from '../services/inventoryRepository'
import { DEFAULT_CREATE_YARN_DRAFT } from '../types/yarn'
import { useYarnInventory } from './useYarnInventory'

describe('useYarnInventory persistence', () => {
  it('persists numeric measurement and weight values across reloads', async () => {
    let persisted: unknown[] = []

    const repository: InventoryRepository = {
      async load() {
        return persisted as never
      },
      async save(records) {
        persisted = JSON.parse(JSON.stringify(records)) as unknown[]
      },
    }

    const firstMount = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(firstMount.result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await firstMount.result.current.createRecordFromDraft({
        ...DEFAULT_CREATE_YARN_DRAFT,
        maker: 'Test Maker',
        yarnName: 'Metric Sock',
        materialType: 'Merino',
        yardage: '385.5',
        meters: '352.4',
        grams: '100',
        weightCategory: 'fingering',
      })
    })

    firstMount.unmount()

    const secondMount = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(secondMount.result.current.isLoading).toBe(false)
    })

    const [record] = secondMount.result.current.records

    expect(record?.totalYardage).toBe(385.5)
    expect(record?.totalMeters).toBe(352.4)
    expect(record?.totalGrams).toBe(100)
    expect(record?.weightCategory).toBe('fingering')
  })
})
