import { describe, it, expect, beforeEach } from 'vitest'
import { buildSeedState } from '../data/seed'
import {
  followersOf,
  followingOf,
  otherParticipant,
  unreadDmCount,
  unreadNotificationCount,
} from './selectors'

const NOW = Date.now()
let s = buildSeedState(NOW)

beforeEach(() => {
  s = buildSeedState(NOW)
})

describe('relationship selectors', () => {
  it('followersOf finds everyone following a user', () => {
    const followers = followersOf(s, 'u_me').map((u) => u.id)
    expect(followers).toContain('u_mara')
    expect(followers).toContain('u_theo')
    expect(followers).toContain('u_june')
  })

  it('followingOf resolves the followed users in order', () => {
    const following = followingOf(s, 'u_me').map((u) => u.id)
    expect(following).toEqual(['u_mara', 'u_theo', 'u_june', 'u_ravi'])
  })

  it('followingOf returns empty for an unknown user', () => {
    expect(followingOf(s, 'u_nope')).toEqual([])
  })
})

describe('unread counts', () => {
  it('counts 1 unread DM and 2 unread notifications in the seed', () => {
    expect(unreadDmCount(s)).toBe(1)
    expect(unreadNotificationCount(s)).toBe(2)
  })

  it('otherParticipant finds the non-me side of a thread', () => {
    const thread = s.threads.find((t) => t.id === 't_mara')!
    expect(otherParticipant(s, thread)?.id).toBe('u_mara')
  })
})
