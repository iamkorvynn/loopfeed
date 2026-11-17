/**
 * Generated art: every image in LoopFeed is drawn in code, never a photo.
 * Each demo user owns one ArtStyle (a palette + a shape language); a numeric
 * seed varies the composition deterministically, so the same post always
 * renders the same art. No copyrighted images anywhere in the repo.
 */
import type { ArtStyle } from '../types'
import { mulberry32 } from '../utils/ids'

export const ART_STYLES: ArtStyle[] = [
  'sunset',
  'ocean',
  'forest',
  'neon',
  'mono',
  'candy',
  'dusk',
  'geo',
]

/** [background, mid, accent] per style. */
export const PALETTES: Record<ArtStyle, [string, string, string]> = {
  sunset: ['#ff7a18', '#ff3d68', '#ffd166'],
  ocean: ['#0ea5e9', '#1d4ed8', '#67e8f9'],
  forest: ['#166534', '#22c55e', '#a3e635'],
  neon: ['#111827', '#a855f7', '#22d3ee'],
  mono: ['#18181b', '#52525b', '#e4e4e7'],
  candy: ['#ec4899', '#f472b6', '#fde68a'],
  dusk: ['#312e81', '#7c3aed', '#f59e0b'],
  geo: ['#f8fafc', '#0f766e', '#f97316'],
}

export interface ArtShape {
  kind: 'circle' | 'rect' | 'triangle' | 'ring' | 'bar'
  x: number
  y: number
  size: number
  rotate: number
  color: string
  opacity: number
}

/** Deterministic composition for a (style, seed) pair. */
export function artComposition(style: ArtStyle, seed: number): ArtShape[] {
  const rand = mulberry32(seed * 7919 + style.length * 131)
  const palette = PALETTES[style]
  const kinds: ArtShape['kind'][] = ['circle', 'rect', 'triangle', 'ring', 'bar']
  const count = 5 + Math.floor(rand() * 4)
  const shapes: ArtShape[] = []
  for (let i = 0; i < count; i++) {
    shapes.push({
      kind: kinds[Math.floor(rand() * kinds.length)],
      x: 8 + rand() * 84,
      y: 8 + rand() * 84,
      size: 8 + rand() * 26,
      rotate: Math.floor(rand() * 180),
      color: palette[Math.floor(rand() * palette.length)],
      opacity: 0.55 + rand() * 0.45,
    })
  }
  return shapes
}

export function artGradientId(style: ArtStyle, seed: number): string {
  return `lf-${style}-${seed}`
}
