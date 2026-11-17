import { describe, it, expect, beforeEach } from 'vitest'
import { getState, resetState, createPost, editProfile } from './store'
import { feedPosts, explorePosts, liveStories, savedPosts, searchAll, suggestedUsers } from './selectors'

const NOW = Date.now()

beforeEach(() => {
  localStorage.clear()
  resetState(NOW)
})

describe('Loops', () => {
  it('seed contains Loop posts with day/total', () => {
    const loops = getState().posts.filter((p) => p.loop)
    expect(loops.length).toBeGreaterThanOrEqual(5)
    for (const p of loops) {
      expect(p.loop!.day).toBeGreaterThanOrEqual(1)
      expect(p.loop!.day).toBeLessThanOrEqual(p.loop!.total)
    }
  })

  it('creating a Loop post puts it at the top of the feed', () => {
    const post = createPost({
      caption: 'Day 1 of 7 — starting the loop',
      artSeed: 999,
      artStyle: 'ocean',
      loop: { series: '7 days of sketches', day: 1, total: 7 },
    })
    expect(post.loop).toEqual({ series: '7 days of sketches', day: 1, total: 7 })
    expect(feedPosts(getState())[0].id).toBe(post.id)
  })

  it('creating a plain post works without a loop', () => {
    const post = createPost({ caption: 'just a post', artSeed: 1, artStyle: 'mono' })
    expect(post.loop).toBeUndefined()
  })
})

describe('selectors', () => {
  it('feed shows only own + followed users, newest first', () => {
    const feed = feedPosts(getState())
    const me = getState().users.find((u) => u.id === 'u_me')!
    const allowed = new Set([me.id, ...me.following])
    expect(feed.every((p) => allowed.has(p.userId))).toBe(true)
    expect(feed.length).toBeGreaterThan(0)
    for (let i = 1; i < feed.length; i++) {
      expect(feed[i - 1].createdAt).toBeGreaterThanOrEqual(feed[i].createdAt)
    }
  })

  it('explore sorts most-liked first', () => {
    const ex = explorePosts(getState())
    expect(ex[0].likeIds.length).toBeGreaterThanOrEqual(ex[1].likeIds.length)
  })

  it('live stories exclude the expired one', () => {
    const live = liveStories(getState(), NOW)
    expect(live.some((s) => s.id === 's_noor_expired')).toBe(false)
    expect(live.length).toBe(5)
  })

  it('saved posts returns only posts I saved', () => {
    const saved = savedPosts(getState(), 'u_me')
    expect(saved.length).toBeGreaterThan(0)
    expect(saved.every((p) => p.saveIds.includes('u_me'))).toBe(true)
  })

  it('search finds users by username and posts by Loop series', () => {
    const byUser = searchAll(getState(), 'mara')
    expect(byUser.users.map((u) => u.id)).toContain('u_mara')
    const byLoop = searchAll(getState(), 'one-pot')
    expect(byLoop.posts.map((p) => p.id)).toContain('p_ravi_pot_3')
    expect(searchAll(getState(), '   ')).toEqual({ users: [], posts: [] })
  })

  it('suggestions exclude me and people I already follow', () => {
    const sug = suggestedUsers(getState())
    const me = getState().users.find((u) => u.id === 'u_me')!
    expect(sug.every((u) => u.id !== 'u_me' && !me.following.includes(u.id))).toBe(true)
  })
})

describe('editProfile', () => {
  it('updates name, bio and style', () => {
    expect(editProfile({ displayName: 'New Name', bio: 'new bio', artStyle: 'neon' })).toBe(true)
    const me = getState().users.find((u) => u.id === 'u_me')!
    expect(me.displayName).toBe('New Name')
    expect(me.bio).toBe('new bio')
    expect(me.artStyle).toBe('neon')
  })

  it('rejects an empty display name', () => {
    expect(editProfile({ displayName: '   ', bio: 'x', artStyle: 'mono' })).toBe(false)
  })
})
