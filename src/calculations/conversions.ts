const YARDS_TO_METERS = 0.9144
const OUNCES_TO_GRAMS = 28.349523125

export const yardsToMeters = (yards: number): number => yards * YARDS_TO_METERS

export const metersToYards = (meters: number): number =>
  meters / YARDS_TO_METERS

export const ouncesToGrams = (ounces: number): number =>
  ounces * OUNCES_TO_GRAMS

export const gramsToOunces = (grams: number): number => grams / OUNCES_TO_GRAMS
