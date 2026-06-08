import {
  type CreateYarnDraft,
  type WeightCategory,
  type Yarn,
} from '../types/yarn'

const toNumber = (value: string): number => Number(value)

const normalizeWeightCategory = (value: string): WeightCategory => {
  const categories: WeightCategory[] = [
    'lace',
    'fingering',
    'sport',
    'dk',
    'worsted',
    'aran',
    'bulky',
  ]

  if (categories.includes(value as WeightCategory)) {
    return value as WeightCategory
  }

  return 'fingering'
}

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
  const now = new Date().toISOString()

  return {
    id: createId(),
    maker: draft.maker.trim(),
    yarnName: draft.yarnName.trim(),
    materialType: draft.materialType.trim(),
    weightCategory: normalizeWeightCategory(draft.weightCategory),
    handDyed: draft.handDyed,
    superwash: draft.superwash,
    quantityInStock: toNumber(draft.quantityInStock),
    totalYardage: toNumber(draft.yardage),
    totalMeters: toNumber(draft.meters),
    totalGrams: toNumber(draft.grams),
    image: draft.imageUrl
      ? {
          id: createId(),
          url: draft.imageUrl,
          alt: `${draft.maker} ${draft.yarnName}`.trim(),
        }
      : undefined,
    archived: draft.archived,
    createdAt: now,
    updatedAt: now,
  }
}
