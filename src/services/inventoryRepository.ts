import type { Yarn } from '../types/yarn'

export interface InventoryRepository {
  load(): Promise<Yarn[]>
  save(records: Yarn[]): Promise<void>
}

const STORAGE_KEY = 'skeinventory.records.v1'

const isYarnRecord = (value: unknown): value is Yarn => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<Yarn>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.maker === 'string' &&
    typeof candidate.yarnName === 'string' &&
    typeof candidate.materialType === 'string' &&
    typeof candidate.weightCategory === 'string' &&
    typeof candidate.quantityInStock === 'number' &&
    typeof candidate.handDyed === 'boolean' &&
    typeof candidate.superwash === 'boolean' &&
    typeof candidate.archived === 'boolean' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  )
}

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

    return parsed.filter((record) => isYarnRecord(record))
  },
  async save(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  },
}
