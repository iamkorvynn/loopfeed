import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { SearchView } from './SearchView'

const NOW = Date.now()

beforeEach(() => {
  localStorage.clear()
  resetState(NOW)
})

describe('SearchView', () => {
  it('shows a hint before searching', () => {
    const s = buildSeedState(NOW)
    render(<SearchView state={s} onOpenProfile={() => {}} onOpenPost={() => {}} />)
    expect(screen.getByText(/Try “clay”/)).toBeInTheDocument()
  })

  it('finds a person by username', () => {
    const s = buildSeedState(NOW)
    render(<SearchView state={s} onOpenProfile={() => {}} onOpenPost={() => {}} />)
    fireEvent.change(screen.getByLabelText('Search LoopFeed'), { target: { value: 'mara' } })
    expect(screen.getByText('mara.makes')).toBeInTheDocument()
  })

  it('finds posts by Loop series name', () => {
    const s = buildSeedState(NOW)
    render(<SearchView state={s} onOpenProfile={() => {}} onOpenPost={() => {}} />)
    fireEvent.change(screen.getByLabelText('Search LoopFeed'), { target: { value: 'one-pot' } })
    expect(screen.getByLabelText(/Post: Day 3 of 7 one-pot dinners/)).toBeInTheDocument()
  })

  it('reports no results for unknown queries', () => {
    const s = buildSeedState(NOW)
    render(<SearchView state={s} onOpenProfile={() => {}} onOpenPost={() => {}} />)
    fireEvent.change(screen.getByLabelText('Search LoopFeed'), { target: { value: 'zzzzqqq' } })
    expect(screen.getByText(/No results for/)).toBeInTheDocument()
  })
})
