/**
 * Unit tests for subscription helper functions
 * 
 * Run with: npm test subscription-helpers
 */

import {
  getPlanLabel,
  getPlanBadgeClass,
  getPlanAmount,
  getPlanDuration,
  getDaysUntilExpiry,
  isSubscriptionActive,
} from '../subscription-helpers'

describe('getPlanLabel', () => {
  it('should return "Trial Gratis" for trial origin regardless of plan_type', () => {
    expect(getPlanLabel('monthly', 'trial')).toBe('Trial Gratis')
    expect(getPlanLabel('annual', 'trial')).toBe('Trial Gratis')
    expect(getPlanLabel('trial', 'trial')).toBe('Trial Gratis')
  })

  it('should return "Paket Tahunan" for annual paid subscription', () => {
    expect(getPlanLabel('annual', 'paid')).toBe('Paket Tahunan')
  })

  it('should return "Paket Bulanan" for monthly paid subscription', () => {
    expect(getPlanLabel('monthly', 'paid')).toBe('Paket Bulanan')
  })
})

describe('getPlanBadgeClass', () => {
  it('should return amber badge for trial origin', () => {
    const result = getPlanBadgeClass('monthly', 'trial')
    expect(result).toContain('amber')
  })

  it('should return dark green badge for annual paid', () => {
    const result = getPlanBadgeClass('annual', 'paid')
    expect(result).toContain('green-800')
  })

  it('should return light green badge for monthly paid', () => {
    const result = getPlanBadgeClass('monthly', 'paid')
    expect(result).toContain('green-100')
  })
})

describe('getPlanAmount', () => {
  it('should return correct amount for monthly plan', () => {
    expect(getPlanAmount('monthly')).toBe('Rp20.000')
  })

  it('should return correct amount for annual plan', () => {
    expect(getPlanAmount('annual')).toBe('Rp200.000')
  })
})

describe('getPlanDuration', () => {
  it('should return "/bulan" for monthly plan', () => {
    expect(getPlanDuration('monthly')).toBe('/bulan')
  })

  it('should return "/tahun" for annual plan', () => {
    expect(getPlanDuration('annual')).toBe('/tahun')
  })
})

describe('getDaysUntilExpiry', () => {
  it('should return null for null input', () => {
    expect(getDaysUntilExpiry(null)).toBeNull()
  })

  it('should return positive days for future date', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 5)
    const days = getDaysUntilExpiry(futureDate)
    expect(days).toBeGreaterThan(0)
    expect(days).toBeLessThanOrEqual(5)
  })

  it('should return negative days for past date', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 5)
    const days = getDaysUntilExpiry(pastDate)
    expect(days).toBeLessThan(0)
  })

  it('should handle ISO string input', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 3)
    const days = getDaysUntilExpiry(futureDate.toISOString())
    expect(days).toBeGreaterThan(0)
  })
})

describe('isSubscriptionActive', () => {
  it('should return false for null input', () => {
    expect(isSubscriptionActive(null)).toBe(false)
  })

  it('should return true for future date', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 5)
    expect(isSubscriptionActive(futureDate)).toBe(true)
  })

  it('should return false for past date', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 5)
    expect(isSubscriptionActive(pastDate)).toBe(false)
  })

  it('should handle ISO string input', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 3)
    expect(isSubscriptionActive(futureDate.toISOString())).toBe(true)
  })
})

describe('Edge cases', () => {
  it('should handle empty strings gracefully', () => {
    expect(getPlanLabel('', '')).toBe('Paket Bulanan') // defaults to monthly
    expect(getPlanBadgeClass('', '')).toContain('green-100') // defaults to monthly
  })

  it('should handle unknown plan types', () => {
    expect(getPlanLabel('unknown', 'paid')).toBe('Paket Bulanan')
  })

  it('should prioritize origin over plan_type', () => {
    // Even if plan_type is 'annual', trial origin should show "Trial Gratis"
    expect(getPlanLabel('annual', 'trial')).toBe('Trial Gratis')
  })
})
