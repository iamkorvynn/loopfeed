import { describe, it, expect } from 'vitest'
import { buildSeedState } from './seed'

/** The seed must be internally consistent: every id it references exists. */
describe('seed invariants', () => {
  const s = buildSeedState(Date.now())

  it('every post, story, comment and notification references a real user', () => {
    const userIds = new Set(s.users.map((u) => u.id))
    for (const p of s.posts) expect(userIds.has(p.userId)).toBe(true)
    for (const st of s.stories) expect(userIds.has(st.userId)).toBe(true)
    for (const c of s.comments) expect(userIds.has(c.userId)).toBe(true)
    for (const n of s.notifications) expect(userIds.has(n.actorId)).toBe(true)
    expect(userIds.has(s.currentUserId)).toBe(true)
  })

  it('every comment and notification post reference exists', () => {
    const postIds = new Set(s.posts.map((p) => p.id))
    for (const c of s.comments) expect(postIds.has(c.postId)).toBe(true)
    for (const n of s.notifications) {
      if (n.postId) expect(postIds.has(n.postId)).toBe(true)
    }
  })

  it('threads are 1:1 with real participants and real senders', () => {
    const userIds = new Set(s.users.map((u) => u.id))
    for (const t of s.threads) {
      expect(t.participantIds.length).toBe(2)
      for (const id of t.participantIds) expect(userIds.has(id)).toBe(true)
      for (const m of t.messages) {
        expect(m.threadId).toBe(t.id)
        expect(t.participantIds).toContain(m.senderId)
      }
    }
  })

  it('nobody follows themselves and nobody follows a stranger', () => {
    const userIds = new Set(s.users.map((u) => u.id))
    for (const u of s.users) {
      expect(u.following).not.toContain(u.id)
      for (const id of u.following) expect(userIds.has(id)).toBe(true)
    }
  })

  it('usernames are unique and every poll has two options', () => {
    const names = s.users.map((u) => u.username)
    expect(new Set(names).size).toBe(names.length)
    for (const st of s.stories) {
      if (st.poll) {
        expect(st.poll.options.length).toBe(2)
        expect(st.poll.votes.length).toBe(2)
        expect(st.poll.votes[0] + st.poll.votes[1]).toBeGreaterThan(0)
      }
    }
  })
})
