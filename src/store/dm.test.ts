import { describe, it, expect, beforeEach } from 'vitest'
import { getState, markThreadRead, resetState, sendMessage } from './store'
import { sortedThreads, unreadDmCount } from './selectors'
import { buildSeedState } from '../data/seed'

const NOW = Date.UTC(2026, 10, 18, 2, 0, 0)

beforeEach(() => {
  localStorage.clear()
  resetState(NOW)
})

describe('DMs', () => {
  it('seed has exactly one unread DM for you', () => {
    expect(unreadDmCount(getState())).toBe(1)
  })

  it('sending appends to the existing thread', () => {
    const msg = sendMessage('u_mara', 'see you at 6!', 't_mara')
    expect(msg).not.toBeNull()
    const thread = getState().threads.find((t) => t.id === 't_mara')!
    expect(thread.messages[thread.messages.length - 1].text).toBe('see you at 6!')
    expect(thread.messages[thread.messages.length - 1].senderId).toBe('u_me')
  })

  it('sending to a user with no thread creates one', () => {
    const msg = sendMessage('u_noor', 'love the poster series!')
    expect(msg).not.toBeNull()
    const thread = getState().threads.find((t) => t.id === msg!.threadId)!
    expect(thread.participantIds).toEqual(expect.arrayContaining(['u_me', 'u_noor']))
    expect(getState().threads.length).toBe(4)
  })

  it('rejects empty messages', () => {
    expect(sendMessage('u_mara', '   ', 't_mara')).toBeNull()
  })

  it('markThreadRead clears unread and drops the badge count', () => {
    markThreadRead('t_mara')
    expect(unreadDmCount(getState())).toBe(0)
    const thread = getState().threads.find((t) => t.id === 't_mara')!
    expect(thread.messages.every((m) => m.read || m.senderId === 'u_me')).toBe(true)
  })

  it('threads sort by latest message, newest first', () => {
    const sorted = sortedThreads(getState())
    expect(sorted[0].id).toBe('t_theo')
    expect(sorted[sorted.length - 1].id).toBe('t_june')
  })

  it('a fresh send bumps its thread to the top', () => {
    sendMessage('u_june', 'bumping this thread', 't_june')
    expect(sortedThreads(getState())[0].id).toBe('t_june')
  })

  it('seed helper is deterministic for a fixed now', () => {
    const a = buildSeedState(NOW)
    const b = buildSeedState(NOW)
    expect(a.posts.map((p) => p.id)).toEqual(b.posts.map((p) => p.id))
  })
})
