import { describe, expect, it } from 'vitest'
import type { Yarn } from '../types/yarn'
import { DEFAULT_CREATE_YARN_DRAFT } from '../types/yarn'
import {
  createDraftFromYarn,
  createYarnFromDraft,
  normalizeYarnDraftValues,
} from './yarnFactory'

describe('yarnFactory', () => {
  it('normalizes core detail fields by trimming values', () => {
    const normalized = normalizeYarnDraftValues({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: '  Malabrigo  ',
      yarnName: '  Rios ',
      materialType: '  Merino Wool ',
    })

    expect(normalized.maker).toBe('Malabrigo')
    expect(normalized.yarnName).toBe('Rios')
    expect(normalized.materialType).toBe('Merino Wool')
  })

  it('creates a record containing persisted core detail fields', () => {
    const created = createYarnFromDraft({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: 'Cascade',
      yarnName: '220 Superwash',
      materialType: 'Wool',
    })

    expect(created.maker).toBe('Cascade')
    expect(created.yarnName).toBe('220 Superwash')
    expect(created.materialType).toBe('Wool')
    expect(created.id).toBeTruthy()
  })

  it('builds editable draft values from an existing yarn record', () => {
    const record: Yarn = {
      id: 'yarn-1',
      maker: 'Lion Brand',
      yarnName: 'Wool-Ease',
      materialType: 'Acrylic/Wool Blend',
      weightCategory: 'worsted',
      handDyed: false,
      superwash: false,
      quantityInStock: 2,
      totalYardage: 197,
      totalMeters: 180,
      totalGrams: 85,
      archived: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }

    const draft = createDraftFromYarn(record)

    expect(draft.maker).toBe(record.maker)
    expect(draft.yarnName).toBe(record.yarnName)
    expect(draft.materialType).toBe(record.materialType)
  })

  it('normalizes numeric measurement strings to numbers without derived math', () => {
    const normalized = normalizeYarnDraftValues({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: 'Malabrigo',
      yarnName: 'Rios',
      materialType: 'Merino Wool',
      yardage: '210',
      meters: '192.5',
      grams: '100',
      quantityInStock: '2.25',
    })

    expect(normalized.totalYardage).toBe(210)
    expect(normalized.totalMeters).toBe(192.5)
    expect(normalized.totalGrams).toBe(100)
    expect(normalized.quantityInStock).toBe(2.25)
  })

  it('preserves valid weight category input during normalization', () => {
    const normalized = normalizeYarnDraftValues({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: 'Malabrigo',
      yarnName: 'Rios',
      materialType: 'Merino Wool',
      weightCategory: 'dk',
    })

    expect(normalized.weightCategory).toBe('dk')
  })

  it('preserves boolean toggle values without coercion', () => {
    const normalized = normalizeYarnDraftValues({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: 'Malabrigo',
      yarnName: 'Rios',
      materialType: 'Merino Wool',
      handDyed: true,
      superwash: false,
    })

    expect(normalized.handDyed).toBe(true)
    expect(normalized.superwash).toBe(false)
  })

  it('maps non-empty image URL into persisted imageUrl field', () => {
    const created = createYarnFromDraft({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: 'Cascade',
      yarnName: '220 Superwash',
      materialType: 'Wool',
      imageUrl: 'https://example.com/yarn.jpg',
    })

    expect(created.imageUrl).toBe('https://example.com/yarn.jpg')
  })

  it('omits persisted imageUrl when input is blank', () => {
    const created = createYarnFromDraft({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: 'Cascade',
      yarnName: '220 Superwash',
      materialType: 'Wool',
      imageUrl: '   ',
    })

    expect(created.imageUrl).toBeUndefined()
  })
})
