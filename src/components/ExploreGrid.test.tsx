import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { ExploreGrid } from './ExploreGrid'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('ExploreGrid', () => {
  it('renders all posts, most-liked first', () => {
    const s = buildSeedState(Date.now())
    render(<ExploreGrid state={s} onOpenPost={() => {}} />)
    expect(screen.getByText('Explore')).toBeInTheDocument()
    // 12 tiles, one per post
    expect(document.querySelectorAll('.explore-tile').length).toBe(12)
  })

  it('Loops-only filter narrows to series posts', () => {
    const s = buildSeedState(Date.now())
    render(<ExploreGrid state={s} onOpenPost={() => {}} />)
    fireEvent.click(screen.getByLabelText('Loops only'))
    expect(document.querySelectorAll('.explore-tile').length).toBe(6)
  })

  it('clicking a tile opens that post', () => {
    const s = buildSeedState(Date.now())
    const opened: string[] = []
    render(<ExploreGrid state={s} onOpenPost={(id) => opened.push(id)} />)
    const tiles = document.querySelectorAll('.explore-tile')
    fireEvent.click(tiles[0])
    expect(opened.length).toBe(1)
  })
})
