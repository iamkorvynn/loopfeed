import { describe, it, expect, beforeEach } from 'vitest'
import { buildSeedState } from '../data/seed'
import {
  addComment,
  createPost,
  getState,
  resetState,
  setStateForTests,
  toggleFollow,
  toggleLike,
  toggleSave,
  uploadedImages,
} from './store'

const NOW = Date.now()

beforeEach(() => {
  localStorage.clear()
  resetState(NOW)
})

describe('toggleLike', () => {
  it('likes a post that is not liked yet', () => {
    const post = getState().posts.find((p) => p.id === 'p_finn_sunrise')!
    expect(post.likeIds).not.toContain('u_me')
    const liked = toggleLike('p_finn_sunrise')
    expect(liked).toBe(true)
    expect(getState().posts.find((p) => p.id === 'p_finn_sunrise')!.likeIds).toContain('u_me')
  })

  it('unlikes a post that is already liked', () => {
    const before = getState().posts.find((p) => p.id === 'p_mara_clay_12')!.likeIds.length
    expect(toggleLike('p_mara_clay_12')).toBe(false)
    expect(getState().posts.find((p) => p.id === 'p_mara_clay_12')!.likeIds.length).toBe(before - 1)
  })

  it('returns false for an unknown post', () => {
    expect(toggleLike('p_nope')).toBe(false)
  })

  it('persists the like to localStorage', () => {
    toggleLike('p_finn_sunrise')
    const raw = localStorage.getItem('loopfeed-state-v1')
    expect(raw).toContain('p_finn_sunrise')
    const parsed = JSON.parse(raw!)
    expect(parsed.posts.find((p: { id: string }) => p.id === 'p_finn_sunrise').likeIds).toContain('u_me')
  })
})

describe('toggleSave', () => {
  it('saves then unsaves a post', () => {
    expect(toggleSave('p_theo_gen_41')).toBe(true)
    expect(toggleSave('p_theo_gen_41')).toBe(false)
  })
})

describe('toggleFollow', () => {
  it('follows a user you do not follow', () => {
    expect(getState().users.find((u) => u.id === 'u_me')!.following).not.toContain('u_noor')
    expect(toggleFollow('u_noor')).toBe(true)
    expect(getState().users.find((u) => u.id === 'u_me')!.following).toContain('u_noor')
  })

  it('unfollows a user you follow', () => {
    expect(toggleFollow('u_mara')).toBe(false)
    expect(getState().users.find((u) => u.id === 'u_me')!.following).not.toContain('u_mara')
  })

  it('cannot follow yourself', () => {
    expect(toggleFollow('u_me')).toBe(false)
    expect(getState().users.find((u) => u.id === 'u_me')!.following).not.toContain('u_me')
  })
})

describe('addComment', () => {
  it('adds a comment with trimmed text', () => {
    const c = addComment('p_finn_sunrise', '  love this run  ')
    expect(c).not.toBeNull()
    expect(c!.text).toBe('love this run')
    expect(getState().comments.some((x) => x.id === c!.id)).toBe(true)
  })

  it('rejects empty and whitespace-only comments', () => {
    expect(addComment('p_finn_sunrise', '   ')).toBeNull()
    expect(addComment('p_finn_sunrise', '')).toBeNull()
  })

  it('rejects comments on unknown posts', () => {
    expect(addComment('p_nope', 'hi')).toBeNull()
  })
})

describe('seed sanity', () => {
  it('seeds 8 users, 12 posts, 6 stories and 3 threads', () => {
    const s = buildSeedState(NOW)
    expect(s.users.length).toBe(8)
    expect(s.posts.length).toBe(12)
    expect(s.stories.length).toBe(6)
    expect(s.threads.length).toBe(3)
    expect(s.currentUserId).toBe('u_me')
  })

  it('setStateForTests replaces state (test helper)', () => {
    const s = buildSeedState(NOW)
    s.users = []
    setStateForTests(s)
    expect(getState().users.length).toBe(0)
  })
})

describe('createPost with upload', () => {
  it('stores the uploaded image data URL outside localStorage state', () => {
    const post = createPost({
      caption: 'uploaded art',
      artSeed: 5,
      artStyle: 'ocean',
      imageDataUrl: 'data:image/png;base64,abc',
    })
    expect(uploadedImages.get(post.id)).toBe('data:image/png;base64,abc')
    expect(getState().posts[0].id).toBe(post.id)
  })
})

describe('toggleSave edge cases', () => {
  it('returns false for an unknown post', () => {
    expect(toggleSave('p_nope')).toBe(false)
  })
})
