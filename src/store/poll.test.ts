import { describe, it, expect, beforeEach } from 'vitest'
import { getState, isStoryExpired, markStoryViewed, resetState, votePoll } from './store'

const NOW = Date.UTC(2026, 10, 18, 2, 0, 0)

beforeEach(() => {
  localStorage.clear()
  resetState(NOW)
})

describe('story expiry (24h)', () => {
  it('a story created 1h ago is live', () => {
    const s = getState().stories.find((x) => x.id === 's_theo_poll')!
    expect(isStoryExpired(s, NOW)).toBe(false)
  })

  it('a story created 26h ago is expired', () => {
    const s = getState().stories.find((x) => x.id === 's_noor_expired')!
    expect(isStoryExpired(s, NOW)).toBe(true)
  })

  it('a story exactly at the 24h boundary is still live', () => {
    const s = getState().stories.find((x) => x.id === 's_theo_poll')!
    expect(isStoryExpired({ ...s, createdAt: NOW - 24 * 3_600_000 }, NOW)).toBe(false)
  })
})

describe('poll voting', () => {
  it('voting increments the chosen option', () => {
    const before = getState().stories.find((x) => x.id === 's_theo_poll')!.poll!.votes
    expect(votePoll('s_theo_poll', 0)).toBe(true)
    const after = getState().stories.find((x) => x.id === 's_theo_poll')!.poll!.votes
    expect(after[0]).toBe(before[0] + 1)
    expect(after[1]).toBe(before[1])
  })

  it('re-voting moves the vote instead of adding one', () => {
    votePoll('s_theo_poll', 0)
    votePoll('s_theo_poll', 1)
    const poll = getState().stories.find((x) => x.id === 's_theo_poll')!.poll!
    expect(poll.votes).toEqual([14, 10])
    expect(poll.voterIds['u_me']).toBe(1)
  })

  it('voting twice for the same option is a no-op', () => {
    votePoll('s_ravi_poll', 1)
    const once = getState().stories.find((x) => x.id === 's_ravi_poll')!.poll!.votes
    votePoll('s_ravi_poll', 1)
    const twice = getState().stories.find((x) => x.id === 's_ravi_poll')!.poll!.votes
    expect(twice).toEqual(once)
  })

  it('returns false for stories without a poll or unknown stories', () => {
    expect(votePoll('s_mara_kiln', 0)).toBe(false)
    expect(votePoll('s_nope', 0)).toBe(false)
  })
})

describe('markStoryViewed', () => {
  it('records the viewer once', () => {
    markStoryViewed('s_mara_kiln')
    markStoryViewed('s_mara_kiln')
    const viewedBy = getState().stories.find((x) => x.id === 's_mara_kiln')!.viewedBy
    expect(viewedBy.filter((id) => id === 'u_me').length).toBe(1)
  })
})
