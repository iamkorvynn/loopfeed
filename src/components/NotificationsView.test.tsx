import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { NotificationsView } from './NotificationsView'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('NotificationsView', () => {
  it('lists notifications newest first with unread ones highlighted', () => {
    const s = buildSeedState(Date.now())
    render(<NotificationsView state={s} onOpenPost={() => {}} />)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    // Two people liked the same post, so the text appears twice.
    expect(screen.getAllByText(/liked your Day 4 sketch post/).length).toBe(2)
    expect(screen.getByText(/started following you/)).toBeInTheDocument()
    expect(document.querySelectorAll('.notif-item--unread').length).toBe(2)
  })

  it('mark all read clears the unread state', () => {
    const s = buildSeedState(Date.now())
    render(<NotificationsView state={s} onOpenPost={() => {}} />)
    fireEvent.click(screen.getByText(/Mark all read/))
    expect(getState().notifications.every((n) => n.read)).toBe(true)
  })

  it('clicking a post notification opens that post', () => {
    const s = buildSeedState(Date.now())
    const opened: string[] = []
    render(<NotificationsView state={s} onOpenPost={(id) => opened.push(id)} />)
    const likeNotes = screen.getAllByText(/liked your Day 4 sketch post/)
    fireEvent.click(likeNotes[0].closest('button')!)
    expect(opened).toContain('p_me_sketch_4')
  })

  it('shows an empty state when there are no notifications', () => {
    const s = buildSeedState(Date.now())
    s.notifications = []
    render(<NotificationsView state={s} onOpenPost={() => {}} />)
    expect(screen.getByText('All quiet')).toBeInTheDocument()
  })
})
