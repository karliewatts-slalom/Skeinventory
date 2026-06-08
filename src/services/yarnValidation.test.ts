import { describe, expect, it } from 'vitest'
import { DEFAULT_CREATE_YARN_DRAFT } from '../types/yarn'
import { validateYarnDraft } from './yarnValidation'

describe('validateYarnDraft', () => {
  it('accepts valid core detail fields', () => {
    const errors = validateYarnDraft({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: 'Malabrigo',
      yarnName: 'Rios',
      materialType: 'Merino Wool',
    })

    expect(errors.maker).toBeUndefined()
    expect(errors.yarnName).toBeUndefined()
    expect(errors.materialType).toBeUndefined()
  })

  it('returns required field errors for core details', () => {
    const errors = validateYarnDraft({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: ' ',
      yarnName: ' ',
      materialType: ' ',
    })

    expect(errors.maker).toBe('Maker is required.')
    expect(errors.yarnName).toBe('Yarn name is required.')
    expect(errors.materialType).toBe('Material type is required.')
  })

  it('shares the same numeric validation between create and edit drafts', () => {
    const errors = validateYarnDraft({
      ...DEFAULT_CREATE_YARN_DRAFT,
      maker: 'Cascade',
      yarnName: '220 Superwash',
      materialType: 'Wool',
      quantityInStock: '-1',
      grams: '-2',
    })

    expect(errors.quantityInStock).toMatch(/non-negative number/i)
    expect(errors.grams).toMatch(/non-negative number/i)
  })
})
