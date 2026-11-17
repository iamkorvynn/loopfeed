import { describe, it, expect, beforeEach } from 'vitest'
import { getState, markAllNotificationsRead, resetState } from './store'
import { unreadNotificationCount } from './selectors'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('notifications', () => {
  it('seed has 2 unread notifications', () => {
    expect(unreadNotificationCount(getState())).toBe(2)
  })

  it('markAllNotificationsRead clears them all', () => {
    markAllNotificationsRead()
    expect(unreadNotificationCount(getState())).toBe(0)
    expect(getState().notifications.every((n) => n.read)).toBe(true)
  })

  it('marking twice is a no-op the second time', () => {
    markAllNotificationsRead()
    const afterFirst = JSON.stringify(getState().notifications)
    markAllNotificationsRead()
    expect(JSON.stringify(getState().notifications)).toBe(afterFirst)
  })
})
