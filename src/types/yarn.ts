export type WeightCategory =
  | 'lace'
  | 'fingering'
  | 'sport'
  | 'dk'
  | 'worsted'
  | 'aran'
  | 'bulky'

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
  archived: boolean
  createdAt: string
  updatedAt: string
}
