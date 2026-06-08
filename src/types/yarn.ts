export type WeightCategory =
  | 'lace'
  | 'fingering'
  | 'sport'
  | 'dk'
  | 'worsted'
  | 'aran'
  | 'bulky'

export interface ImageRef {
  id: string
  url: string
  alt?: string
}

export interface Yarn {
  id: string
  maker: string
  yarnName: string
  materialType: string
  weightCategory: WeightCategory
  handDyed: boolean
  superwash: boolean
  quantityInStock: number
  totalYardage?: number
  totalMeters?: number
  totalGrams?: number
  perSkeinYardage?: number
  perSkeinMeters?: number
  perSkeinGrams?: number
  image?: ImageRef
  archived: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateYarnDraft {
  imageUrl: string
  maker: string
  yarnName: string
  yardage: string
  meters: string
  grams: string
  weightCategory: WeightCategory
  materialType: string
  quantityInStock: string
  handDyed: boolean
  superwash: boolean
  archived: boolean
}

export type CreateYarnFieldError = Partial<
  Record<
    | 'maker'
    | 'yarnName'
    | 'yardage'
    | 'meters'
    | 'grams'
    | 'weightCategory'
    | 'materialType'
    | 'quantityInStock'
    | 'imageUrl',
    string
  >
>

export const DEFAULT_CREATE_YARN_DRAFT: CreateYarnDraft = {
  imageUrl: '',
  maker: '',
  yarnName: '',
  yardage: '0',
  meters: '0',
  grams: '0',
  weightCategory: 'fingering',
  materialType: '',
  quantityInStock: '1',
  handDyed: false,
  superwash: false,
  archived: false,
}
