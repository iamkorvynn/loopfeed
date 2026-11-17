import { describe, it, expect, beforeEach } from 'vitest'
import { buildSeedState } from '../data/seed'
import { STORAGE_KEY, clearPersistedState, loadState, persistState } from './persistence'

beforeEach(() => {
  localStorage.clear()
})

describe('persistence', () => {
  it('round-trips state through localStorage', () => {
    const s = buildSeedState(Date.now())
    persistState(s)
    const loaded = loadState()
    expect(loaded.users.length).toBe(8)
    expect(loaded.posts.map((p) => p.id)).toEqual(s.posts.map((p) => p.id))
    expect(loaded.currentUserId).toBe('u_me')
  })

  it('seeds fresh state when storage is empty', () => {
    const loaded = loadState(Date.now())
    expect(loaded.users.length).toBe(8)
    expect(loaded.posts.length).toBe(12)
  })

  it('reseeds when stored JSON is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    const loaded = loadState(Date.now())
    expect(loaded.users.length).toBe(8)
  })

  it('reseeds when stored data has the wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ users: 'nope', posts: [] }))
    const loaded = loadState(Date.now())
    expect(loaded.users.length).toBe(8)
  })

  it('clear removes the stored key', () => {
    persistState(buildSeedState(Date.now()))
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
    clearPersistedState()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
