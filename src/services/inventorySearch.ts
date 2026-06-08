import type { Yarn } from '../types/yarn'

const normalize = (value: string): string => value.trim().toLowerCase()

export const filterInventory = (records: Yarn[], query: string): Yarn[] => {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return records
  }

  return records.filter((record) => {
    const fields = [
      record.maker,
      record.yarnName,
      record.materialType,
      record.weightCategory,
    ].map(normalize)

    return fields.some((field) => field.includes(normalizedQuery))
  })
}
