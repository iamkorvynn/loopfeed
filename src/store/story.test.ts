import { describe, it, expect, beforeEach } from 'vitest'
import { addComment, addStory, deleteComment, getState, resetState } from './store'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('addStory', () => {
  it('posts a plain story at the front', () => {
    const story = addStory({ caption: 'kiln day!', artSeed: 301, artStyle: 'sunset' })
    expect(story.caption).toBe('kiln day!')
    expect(story.poll).toBeUndefined()
    expect(story.viewedBy).toEqual([])
    expect(getState().stories[0].id).toBe(story.id)
  })

  it('posts a story with an empty poll', () => {
    const story = addStory({
      caption: 'pick one',
      artSeed: 302,
      artStyle: 'neon',
      poll: { question: 'A or B?', options: ['A', 'B'] },
    })
    expect(story.poll).toEqual({ question: 'A or B?', options: ['A', 'B'], votes: [0, 0], voterIds: {} })
  })

  it('trims and caps the caption', () => {
    const story = addStory({ caption: '  hi  ', artSeed: 1, artStyle: 'mono' })
    expect(story.caption).toBe('hi')
  })
})

describe('deleteComment', () => {
  it('lets the author delete their own comment', () => {
    const c = addComment('p_june_stairs', 'temp comment')!
    expect(deleteComment(c.id)).toBe(true)
    expect(getState().comments.some((x) => x.id === c.id)).toBe(false)
  })

  it('lets the post owner delete someone else’s comment', () => {
    // c_1 is Mara's comment on my post p_me_sketch_4.
    expect(deleteComment('c_1')).toBe(true)
    expect(getState().comments.some((x) => x.id === 'c_1')).toBe(false)
  })

  it('blocks a stranger from deleting someone else’s comment', () => {
    // c_4 is June's comment on Ravi's post; I am neither.
    expect(deleteComment('c_4')).toBe(false)
    expect(getState().comments.some((x) => x.id === 'c_4')).toBe(true)
  })

  it('returns false for an unknown comment', () => {
    expect(deleteComment('c_nope')).toBe(false)
  })
})
