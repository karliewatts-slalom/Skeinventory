import {
  WEIGHT_CATEGORIES,
  type CreateYarnDraft,
  type WeightCategory,
  type Yarn,
} from '../types/yarn'

const toNumber = (value: string): number => Number(value)

const normalizeWeightCategory = (value: string): WeightCategory => {
  if (WEIGHT_CATEGORIES.includes(value as WeightCategory)) {
    return value as WeightCategory
  }

  return 'fingering'
}

export interface NormalizedYarnDraftValues {
  maker: string
  yarnName: string
  materialType: string
  weightCategory: WeightCategory
  quantityInStock: number
  totalYardage: number
  totalMeters: number
  totalGrams: number
  handDyed: boolean
  superwash: boolean
  archived: boolean
  imageUrl: string
}

export const normalizeYarnDraftValues = (
  draft: CreateYarnDraft
): NormalizedYarnDraftValues => ({
  maker: draft.maker.trim(),
  yarnName: draft.yarnName.trim(),
  materialType: draft.materialType.trim(),
  weightCategory: normalizeWeightCategory(draft.weightCategory),
  quantityInStock: toNumber(draft.quantityInStock),
  totalYardage: toNumber(draft.yardage),
  totalMeters: toNumber(draft.meters),
  totalGrams: toNumber(draft.grams),
  handDyed: draft.handDyed,
  superwash: draft.superwash,
  archived: draft.archived,
  imageUrl: draft.imageUrl.trim(),
})

export const createDraftFromYarn = (record: Yarn): CreateYarnDraft => ({
  imageUrl: record.image?.url ?? '',
  maker: record.maker,
  yarnName: record.yarnName,
  yardage: String(record.totalYardage ?? 0),
  meters: String(record.totalMeters ?? 0),
  grams: String(record.totalGrams ?? 0),
  weightCategory: record.weightCategory,
  materialType: record.materialType,
  quantityInStock: String(record.quantityInStock),
  handDyed: record.handDyed,
  superwash: record.superwash,
  archived: record.archived,
})

const createId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `yarn-${Date.now()}`
}

export const createYarnFromDraft = (draft: CreateYarnDraft): Yarn => {
  const normalized = normalizeYarnDraftValues(draft)
  const now = new Date().toISOString()

  return {
    id: createId(),
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
    image: normalized.imageUrl
      ? {
          id: createId(),
          url: normalized.imageUrl,
          alt: `${normalized.maker} ${normalized.yarnName}`.trim(),
        }
      : undefined,
    archived: normalized.archived,
    createdAt: now,
    updatedAt: now,
  }
}
