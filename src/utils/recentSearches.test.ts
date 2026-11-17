import { describe, it, expect, beforeEach } from 'vitest'
import { clearRecentSearches, loadRecentSearches, saveRecentSearch } from './recentSearches'

beforeEach(() => {
  localStorage.clear()
})

describe('recent searches', () => {
  it('starts empty and saves in most-recent-first order', () => {
    expect(loadRecentSearches()).toEqual([])
    saveRecentSearch('mara')
    saveRecentSearch('clay')
    expect(loadRecentSearches()).toEqual(['clay', 'mara'])
  })

  it('dedupes case-insensitively and moves repeats to the front', () => {
    saveRecentSearch('Mara')
    saveRecentSearch('clay')
    saveRecentSearch('mara')
    expect(loadRecentSearches()).toEqual(['mara', 'clay'])
  })

  it('keeps at most 5', () => {
    for (const q of ['a', 'b', 'c', 'd', 'e', 'f']) saveRecentSearch(q)
    expect(loadRecentSearches()).toEqual(['f', 'e', 'd', 'c', 'b'])
  })

  it('ignores blank queries and clears', () => {
    saveRecentSearch('   ')
    expect(loadRecentSearches()).toEqual([])
    saveRecentSearch('x')
    clearRecentSearches()
    expect(loadRecentSearches()).toEqual([])
  })
})
