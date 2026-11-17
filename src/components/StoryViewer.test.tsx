import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { StoryViewer } from './StoryViewer'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('StoryViewer', () => {
  it('renders the story caption and marks it viewed', () => {
    const s = buildSeedState(Date.now())
    render(
      <StoryViewer userId="u_theo" state={s} onClose={() => {}} onOpenProfile={() => {}} />,
    )
    expect(screen.getByText('Which palette wins?')).toBeInTheDocument()
    expect(getState().stories.find((x) => x.id === 's_theo_poll')!.viewedBy).toContain('u_me')
  })

  it('voting in the story poll updates the store', () => {
    const s = buildSeedState(Date.now())
    const before = s.stories.find((x) => x.id === 's_theo_poll')!.poll!.votes[0]
    render(
      <StoryViewer userId="u_theo" state={s} onClose={() => {}} onOpenProfile={() => {}} />,
    )
    fireEvent.click(screen.getByText('Neon grid'))
    expect(getState().stories.find((x) => x.id === 's_theo_poll')!.poll!.votes[0]).toBe(before + 1)
  })

  it('replying sends a DM to the story owner', () => {
    const s = buildSeedState(Date.now())
    render(
      <StoryViewer userId="u_theo" state={s} onClose={() => {}} onOpenProfile={() => {}} />,
    )
    fireEvent.change(screen.getByLabelText('Reply to this story'), { target: { value: 'neon, always' } })
    fireEvent.click(screen.getByText('Send'))
    const thread = getState().threads.find((t) => t.id === 't_theo')!
    expect(thread.messages[thread.messages.length - 1].text).toContain('neon, always')
  })

  it('close button calls onClose', () => {
    const s = buildSeedState(Date.now())
    const onClose = vi.fn()
    render(
      <StoryViewer userId="u_theo" state={s} onClose={onClose} onOpenProfile={() => {}} />,
    )
    fireEvent.click(screen.getByLabelText('Close story'))
    expect(onClose).toHaveBeenCalled()
  })
})
