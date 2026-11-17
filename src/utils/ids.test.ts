import { describe, it, expect } from 'vitest'
import { mulberry32, newId } from './ids'

describe('newId', () => {
  it('is prefixed and unique across calls', () => {
    const a = newId('p')
    const b = newId('p')
    expect(a.startsWith('p_')).toBe(true)
    expect(a).not.toBe(b)
    expect(newId('c').startsWith('c_')).toBe(true)
  })
})

describe('mulberry32', () => {
  it('is deterministic for the same seed', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('differs across seeds and stays in [0, 1)', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    expect(a()).not.toBe(b())
    for (let i = 0; i < 100; i++) {
      const v = mulberry32(i)()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})
