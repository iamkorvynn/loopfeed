import type { AppState } from '../types'
import { buildSeedState } from '../data/seed'

export const STORAGE_KEY = 'loopfeed-state-v1'

/** Load persisted state, or fall back to the seed. Corrupt data reseeds. */
export function loadState(now: number = Date.now()): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildSeedState(now)
    const parsed = JSON.parse(raw) as AppState
    if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.posts)) {
      return buildSeedState(now)
    }
    return parsed
  } catch {
    return buildSeedState(now)
  }
}

export function persistState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full / private mode: the app still works in-memory.
  }
}

export function clearPersistedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
