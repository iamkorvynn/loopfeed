import { describe, it, expect } from 'vitest'
import { compactCount, loopProgress, timeAgo } from './format'

const NOW = Date.UTC(2026, 10, 18, 12, 0, 0)

describe('timeAgo', () => {
  it('says just now under a minute', () => {
    expect(timeAgo(NOW - 30_000, NOW)).toBe('just now')
  })
  it('formats minutes, hours, days and weeks', () => {
    expect(timeAgo(NOW - 5 * 60_000, NOW)).toBe('5m')
    expect(timeAgo(NOW - 3 * 3_600_000, NOW)).toBe('3h')
    expect(timeAgo(NOW - 2 * 86_400_000, NOW)).toBe('2d')
    expect(timeAgo(NOW - 14 * 86_400_000, NOW)).toBe('2w')
  })
  it('never goes negative for future timestamps', () => {
    expect(timeAgo(NOW + 60_000, NOW)).toBe('just now')
  })
})

describe('compactCount', () => {
  it('passes small numbers through', () => {
    expect(compactCount(42)).toBe('42')
    expect(compactCount(999)).toBe('999')
  })
  it('compacts thousands and millions', () => {
    expect(compactCount(1250)).toBe('1.3k')
    expect(compactCount(2000)).toBe('2k')
    expect(compactCount(2_400_000)).toBe('2.4M')
  })
})

describe('loopProgress', () => {
  it('is day/total clamped to 0..1', () => {
    expect(loopProgress(3, 7)).toBeCloseTo(3 / 7)
    expect(loopProgress(7, 7)).toBe(1)
    expect(loopProgress(9, 7)).toBe(1)
    expect(loopProgress(0, 7)).toBe(0)
    expect(loopProgress(3, 0)).toBe(0)
  })
})
