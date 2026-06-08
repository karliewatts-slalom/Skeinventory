import type { Yarn } from '../types/yarn'

export interface InventoryRepository {
  load(): Promise<Yarn[]>
  save(records: Yarn[]): Promise<void>
}

const STORAGE_KEY = 'skeinventory.records.v1'

export const localStorageInventoryRepository: InventoryRepository = {
  async load() {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed as Yarn[]
  },
  async save(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  },
}
