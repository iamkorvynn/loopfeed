import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { saveRecentSearch } from '../utils/recentSearches'
import { SearchView } from './SearchView'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('SearchView recent searches', () => {
  it('shows recent chips and fills the query on click', () => {
    saveRecentSearch('clay')
    saveRecentSearch('mara')
    const s = buildSeedState(Date.now())
    render(<SearchView state={s} onOpenProfile={() => {}} onOpenPost={() => {}} />)
    expect(screen.getByText('Recent')).toBeInTheDocument()
    fireEvent.click(screen.getByText('clay'))
    expect(screen.getByLabelText('Search LoopFeed')).toHaveValue('clay')
    expect(screen.getByText('mara.makes')).toBeInTheDocument()
  })

  it('Enter saves the query to recents', () => {
    const s = buildSeedState(Date.now())
    render(<SearchView state={s} onOpenProfile={() => {}} onOpenPost={() => {}} />)
    const input = screen.getByLabelText('Search LoopFeed')
    fireEvent.change(input, { target: { value: 'neon' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.change(input, { target: { value: '' } })
    expect(screen.getByText('neon')).toBeInTheDocument()
  })

  it('Clear removes the recent chips', () => {
    saveRecentSearch('clay')
    const s = buildSeedState(Date.now())
    render(<SearchView state={s} onOpenProfile={() => {}} onOpenPost={() => {}} />)
    fireEvent.click(screen.getByText('Clear'))
    expect(screen.queryByText('clay')).not.toBeInTheDocument()
  })
})
