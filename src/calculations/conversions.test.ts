import { describe, expect, it } from 'vitest'
import { metersToYards, yardsToMeters } from './conversions'

describe('conversions', () => {
  it('converts yards to meters', () => {
    expect(yardsToMeters(100)).toBeCloseTo(91.44, 6)
  })

  it('converts meters to yards', () => {
    expect(metersToYards(91.44)).toBeCloseTo(100, 6)
  })
})
