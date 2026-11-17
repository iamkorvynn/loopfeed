import { useSyncExternalStore } from 'react'
import type { AppState } from '../types'
import { getState, subscribe } from './store'

/** Subscribe a component to the whole store. Selectors derive views from it. */
export function useStore(): AppState {
  return useSyncExternalStore(subscribe, getState)
}
