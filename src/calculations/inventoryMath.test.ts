import { describe, expect, it } from 'vitest'
import { calculateTotals } from './inventoryMath'

describe('calculateTotals', () => {
  it('calculates totals from per-skein values', () => {
    const result = calculateTotals({
      quantityInStock: 2.5,
      perSkeinYardage: 400,
      perSkeinMeters: 365.76,
      perSkeinGrams: 100,
    })

    expect(result.totalYardage).toBe(1000)
    expect(result.totalMeters).toBe(914.4)
    expect(result.totalGrams).toBe(250)
  })

  it('preserves manual total overrides', () => {
    const result = calculateTotals({
      quantityInStock: 2,
      totalYardage: 999,
      perSkeinYardage: 300,
      manualTotalOverrides: { yardage: true },
    })

    expect(result.totalYardage).toBe(999)
  })
})
