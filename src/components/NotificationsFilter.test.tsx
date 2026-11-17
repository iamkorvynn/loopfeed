import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { NotificationsView } from './NotificationsView'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('NotificationsView filter', () => {
  it('Unread tab shows only the 2 unread notifications', () => {
    const s = buildSeedState(Date.now())
    render(<NotificationsView state={s} onOpenPost={() => {}} />)
    fireEvent.click(screen.getByText(/Unread \(2\)/))
    expect(document.querySelectorAll('.notif-item').length).toBe(2)
    expect(screen.queryByText(/started following you/)).not.toBeInTheDocument()
  })

  it('after mark-all-read the Unread tab is empty', () => {
    const s = buildSeedState(Date.now())
    const { rerender } = render(<NotificationsView state={s} onOpenPost={() => {}} />)
    fireEvent.click(screen.getByText(/Mark all read/))
    // Re-render with fresh store state, as the App shell does via useStore.
    const fresh = getState()
    rerender(<NotificationsView state={fresh} onOpenPost={() => {}} />)
    fireEvent.click(screen.getByText(/Unread \(0\)/))
    expect(screen.getByText('All quiet')).toBeInTheDocument()
  })
})
