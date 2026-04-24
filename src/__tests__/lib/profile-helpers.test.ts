import { describe, it, expect } from 'vitest'
import { getDisplayName, getAvatarInitial } from '@/lib/profile-helpers'

describe('getDisplayName', () => {
  it('should return display_name if provided', () => {
    const result = getDisplayName({ display_name: 'John Doe', email: 'john@example.com' })
    expect(result).toBe('John Doe')
  })

  it('should return email username if display_name is null', () => {
    const result = getDisplayName({ display_name: null, email: 'john@example.com' })
    expect(result).toBe('john')
  })

  it('should return email username if display_name is empty', () => {
    const result = getDisplayName({ display_name: '', email: 'john.doe@example.com' })
    expect(result).toBe('john.doe')
  })

  it('should handle email without @ symbol', () => {
    const result = getDisplayName({ display_name: null, email: 'invalid-email' })
    expect(result).toBe('invalid-email')
  })
})

describe('getAvatarInitial', () => {
  it('should return first letter of single word name', () => {
    const result = getAvatarInitial('John')
    expect(result).toBe('J')
  })

  it('should return first letters of two word name', () => {
    const result = getAvatarInitial('John Doe')
    expect(result).toBe('JD')
  })

  it('should return first letters of three word name', () => {
    const result = getAvatarInitial('John Michael Doe')
    expect(result).toBe('JM')
  })

  it('should handle lowercase names', () => {
    const result = getAvatarInitial('john doe')
    expect(result).toBe('JD')
  })

  it('should handle names with extra spaces', () => {
    const result = getAvatarInitial('  John   Doe  ')
    expect(result).toBe('JD')
  })

  it('should handle single character name', () => {
    const result = getAvatarInitial('J')
    expect(result).toBe('J')
  })

  it('should handle empty string', () => {
    const result = getAvatarInitial('')
    expect(result).toBe('')
  })
})
