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

  it('persists edited handDyed and superwash values across reloads', async () => {
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

    const existing = firstMount.result.current.records[0]
    expect(existing).toBeDefined()

    await act(async () => {
      await firstMount.result.current.updateRecordFromDraft(existing!.id, {
        imageUrl: existing?.imageUrl ?? '',
        maker: existing!.maker,
        yarnName: existing!.yarnName,
        yardage: String(existing!.totalYardage ?? 0),
        meters: String(existing!.totalMeters ?? 0),
        grams: String(existing!.totalGrams ?? 0),
        weightCategory: existing!.weightCategory,
        materialType: existing!.materialType,
        quantityInStock: String(existing!.quantityInStock),
        handDyed: !existing!.handDyed,
        superwash: !existing!.superwash,
        archived: existing!.archived,
      })
    })

    firstMount.unmount()

    const secondMount = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(secondMount.result.current.isLoading).toBe(false)
    })

    const reloaded = secondMount.result.current.records.find(
      (record) => record.id === existing!.id
    )

    expect(reloaded?.handDyed).toBe(!existing!.handDyed)
    expect(reloaded?.superwash).toBe(!existing!.superwash)
  })

  it('keeps existing data unchanged and exposes clear error when edit save fails', async () => {
    const repository: InventoryRepository = {
      async load() {
        return [] as never
      },
      async save() {
        throw new Error('write failed')
      },
    }

    const hook = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(hook.result.current.isLoading).toBe(false)
    })

    const existing = hook.result.current.records[0]
    expect(existing).toBeDefined()

    const before = JSON.parse(
      JSON.stringify(hook.result.current.records)
    ) as typeof hook.result.current.records

    let result = false

    await act(async () => {
      result = await hook.result.current.updateRecordFromDraft(existing!.id, {
        imageUrl: existing?.imageUrl ?? '',
        maker: 'Failed Save Maker',
        yarnName: existing!.yarnName,
        yardage: String(existing!.totalYardage ?? 0),
        meters: String(existing!.totalMeters ?? 0),
        grams: String(existing!.totalGrams ?? 0),
        weightCategory: existing!.weightCategory,
        materialType: existing!.materialType,
        quantityInStock: String(existing!.quantityInStock),
        handDyed: existing!.handDyed,
        superwash: existing!.superwash,
        archived: existing!.archived,
      })
    })

    expect(result).toBe(false)
    expect(hook.result.current.operationError).toBe('Saving failed. Please try again.')
    expect(hook.result.current.statusMessage).toBeNull()
    expect(hook.result.current.records).toEqual(before)
  })

  it('archives an active record and persists the archived flag across reloads', async () => {
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

    const existingActive = firstMount.result.current.records.find(
      (record) => !record.archived
    )
    expect(existingActive).toBeDefined()

    await act(async () => {
      await firstMount.result.current.archiveRecord(existingActive!.id)
    })

    firstMount.unmount()

    const secondMount = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(secondMount.result.current.isLoading).toBe(false)
    })

    const reloaded = secondMount.result.current.records.find(
      (record) => record.id === existingActive!.id
    )

    expect(reloaded?.archived).toBe(true)
  })

  it('restores an archived record and persists the active flag across reloads', async () => {
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

    const existingArchived = firstMount.result.current.records.find(
      (record) => record.archived
    )
    expect(existingArchived).toBeDefined()

    await act(async () => {
      await firstMount.result.current.restoreRecord(existingArchived!.id)
    })

    firstMount.unmount()

    const secondMount = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(secondMount.result.current.isLoading).toBe(false)
    })

    const reloaded = secondMount.result.current.records.find(
      (record) => record.id === existingArchived!.id
    )

    expect(reloaded?.archived).toBe(false)
  })

  it('keeps existing data unchanged and exposes clear error when restore save fails', async () => {
    const repository: InventoryRepository = {
      async load() {
        return [] as never
      },
      async save() {
        throw new Error('write failed')
      },
    }

    const hook = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(hook.result.current.isLoading).toBe(false)
    })

    const existingArchived = hook.result.current.records.find(
      (record) => record.archived
    )
    expect(existingArchived).toBeDefined()

    const before = JSON.parse(
      JSON.stringify(hook.result.current.records)
    ) as typeof hook.result.current.records

    let result = false

    await act(async () => {
      result = await hook.result.current.restoreRecord(existingArchived!.id)
    })

    expect(result).toBe(false)
    expect(hook.result.current.operationError).toBe('Restoring failed. Please try again.')
    expect(hook.result.current.statusMessage).toBeNull()
    expect(hook.result.current.records).toEqual(before)
  })

  it('deletes a record and persists removal across reloads', async () => {
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

    const existing = firstMount.result.current.records[0]
    expect(existing).toBeDefined()

    await act(async () => {
      await firstMount.result.current.deleteRecord(existing!.id)
    })

    firstMount.unmount()

    const secondMount = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(secondMount.result.current.isLoading).toBe(false)
    })

    const reloaded = secondMount.result.current.records.find(
      (record) => record.id === existing!.id
    )

    expect(reloaded).toBeUndefined()
  })

  it('keeps existing data unchanged and exposes clear error when delete save fails', async () => {
    const repository: InventoryRepository = {
      async load() {
        return [] as never
      },
      async save() {
        throw new Error('write failed')
      },
    }

    const hook = renderHook(() => useYarnInventory(repository))

    await waitFor(() => {
      expect(hook.result.current.isLoading).toBe(false)
    })

    const existing = hook.result.current.records[0]
    expect(existing).toBeDefined()

    const before = JSON.parse(
      JSON.stringify(hook.result.current.records)
    ) as typeof hook.result.current.records

    let result = false

    await act(async () => {
      result = await hook.result.current.deleteRecord(existing!.id)
    })

    expect(result).toBe(false)
    expect(hook.result.current.operationError).toBe('Deleting failed. Please try again.')
    expect(hook.result.current.statusMessage).toBeNull()
    expect(hook.result.current.records).toEqual(before)
  })
})
