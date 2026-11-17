import { describe, it, expect } from 'vitest'
import { ART_STYLES, PALETTES, artComposition, artGradientId } from './art'

describe('generated art', () => {
  it('defines 8 distinct styles with 3-color palettes', () => {
    expect(ART_STYLES.length).toBe(8)
    for (const style of ART_STYLES) {
      expect(PALETTES[style].length).toBe(3)
      for (const color of PALETTES[style]) {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      }
    }
  })

  it('composition is deterministic for the same seed', () => {
    expect(artComposition('neon', 42)).toEqual(artComposition('neon', 42))
  })

  it('composition differs across seeds and styles', () => {
    expect(artComposition('neon', 42)).not.toEqual(artComposition('neon', 43))
    expect(artComposition('neon', 42)).not.toEqual(artComposition('ocean', 42))
  })

  it('shapes stay inside the 0..100 canvas and use palette colors', () => {
    const shapes = artComposition('sunset', 7)
    expect(shapes.length).toBeGreaterThanOrEqual(5)
    for (const s of shapes) {
      expect(s.x).toBeGreaterThanOrEqual(0)
      expect(s.x).toBeLessThanOrEqual(100)
      expect(s.y).toBeGreaterThanOrEqual(0)
      expect(s.y).toBeLessThanOrEqual(100)
      expect(PALETTES.sunset).toContain(s.color)
      expect(s.opacity).toBeGreaterThan(0)
      expect(s.opacity).toBeLessThanOrEqual(1)
    }
  })

  it('gradient ids are unique per style+seed', () => {
    expect(artGradientId('neon', 1)).not.toBe(artGradientId('ocean', 1))
    expect(artGradientId('neon', 1)).not.toBe(artGradientId('neon', 2))
  })
})
