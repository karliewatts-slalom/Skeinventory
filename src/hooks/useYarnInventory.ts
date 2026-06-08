import { useEffect, useState } from 'react'
import type { CreateYarnDraft, Yarn } from '../types/yarn'
import {
  createYarnFromDraft,
  normalizeYarnDraftValues,
} from '../services/yarnFactory'
import {
  localStorageInventoryRepository,
  type InventoryRepository,
} from '../services/inventoryRepository'
import { sampleInventoryRecords } from '../services/seedData'

interface UseYarnInventoryResult {
  records: Yarn[]
  isLoading: boolean
  operationError: string | null
  statusMessage: string | null
  createRecordFromDraft: (draft: CreateYarnDraft) => Promise<boolean>
  updateRecordFromDraft: (
    id: string,
    draft: CreateYarnDraft
  ) => Promise<boolean>
}

export const useYarnInventory = (
  repository: InventoryRepository = localStorageInventoryRepository
): UseYarnInventoryResult => {
  const [records, setRecords] = useState<Yarn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [operationError, setOperationError] = useState<string | null>(null)
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
        setOperationError(
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

  const createRecordFromDraft = async (
    draft: CreateYarnDraft
  ): Promise<boolean> => {
    setOperationError(null)
    setStatusMessage(null)

    const nextRecord = createYarnFromDraft(draft)
    const nextRecords = [nextRecord, ...records]

    try {
      await repository.save(nextRecords)
      setRecords(nextRecords)
      setStatusMessage('Yarn record added successfully.')
      return true
    } catch {
      setOperationError('Saving failed. Please try again.')
      return false
    }
  }

  const updateRecordFromDraft = async (
    id: string,
    draft: CreateYarnDraft
  ): Promise<boolean> => {
    setOperationError(null)
    setStatusMessage(null)

    const normalized = normalizeYarnDraftValues(draft)
    const nextRecords = records.map((record) =>
      record.id === id
        ? {
            ...record,
            maker: normalized.maker,
            yarnName: normalized.yarnName,
            materialType: normalized.materialType,
            weightCategory: normalized.weightCategory,
            handDyed: normalized.handDyed,
            superwash: normalized.superwash,
            quantityInStock: normalized.quantityInStock,
            totalYardage: normalized.totalYardage,
            totalMeters: normalized.totalMeters,
            totalGrams: normalized.totalGrams,
            archived: normalized.archived,
            imageUrl: normalized.imageUrl || undefined,
            updatedAt: new Date().toISOString(),
          }
        : record
    )

    try {
      await repository.save(nextRecords)
      setRecords(nextRecords)
      setStatusMessage('Yarn record updated successfully.')
      return true
    } catch {
      setOperationError('Saving failed. Please try again.')
      return false
    }
  }

  return {
    records,
    isLoading,
    operationError,
    statusMessage,
    createRecordFromDraft,
    updateRecordFromDraft,
  }
}
