import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { ExploreGrid } from './ExploreGrid'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('ExploreGrid sort', () => {
  it('defaults to most-liked first', () => {
    const s = buildSeedState(Date.now())
    render(<ExploreGrid state={s} onOpenPost={() => {}} />)
    const first = document.querySelector('.explore-tile')
    expect(first?.getAttribute('aria-label')).toContain('theo.frames')
  })

  it('newest sort puts the freshest post first', () => {
    const s = buildSeedState(Date.now())
    render(<ExploreGrid state={s} onOpenPost={() => {}} />)
    fireEvent.change(screen.getByLabelText('Sort explore posts'), { target: { value: 'newest' } })
    const first = document.querySelector('.explore-tile')
    expect(first?.getAttribute('aria-label')).toContain('mara.makes')
  })

  it('Loops-only with no loops shows the empty state', () => {
    const s = buildSeedState(Date.now())
    s.posts = s.posts.filter((p) => !p.loop)
    render(<ExploreGrid state={s} onOpenPost={() => {}} />)
    fireEvent.click(screen.getByLabelText('Loops only'))
    expect(screen.getByText('No Loops yet')).toBeInTheDocument()
  })
})
