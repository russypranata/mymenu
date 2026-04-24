import { describe, it, expect } from 'vitest'
import { getPasswordStrength } from '@/lib/password'

describe('getPasswordStrength', () => {
  it('should return empty for empty password', () => {
    const result = getPasswordStrength('')
    expect(result.score).toBe(0)
    expect(result.label).toBe('')
  })

  it('should return weak for short password', () => {
    const result = getPasswordStrength('abc')
    expect(result.label).toBe('Lemah')
    expect(result.color).toBe('bg-red-400')
  })

  it('should return weak for password with only lowercase', () => {
    const result = getPasswordStrength('abcdefgh')
    expect(result.label).toBe('Lemah')
  })

  it('should return medium for password with lowercase and uppercase', () => {
    const result = getPasswordStrength('Abcdefgh')
    expect(result.label).toBe('Cukup')
    expect(result.color).toBe('bg-yellow-400')
  })

  it('should return medium for password with lowercase and numbers', () => {
    const result = getPasswordStrength('abcdef12')
    expect(result.label).toBe('Cukup')
  })

  it('should return strong for password with lowercase, uppercase, and numbers', () => {
    const result = getPasswordStrength('Abcdef12')
    expect(result.label).toBe('Kuat')
    expect(result.color).toBe('bg-green-400')
  })

  it('should return very strong for password with all character types', () => {
    const result = getPasswordStrength('Abcdef12!')
    expect(result.label).toBe('Sangat Kuat')
    expect(result.color).toBe('bg-green-500')
  })

  it('should handle special characters correctly', () => {
    const result = getPasswordStrength('Test@123')
    expect(result.score).toBe(4)
    expect(result.label).toBe('Sangat Kuat')
  })
})
