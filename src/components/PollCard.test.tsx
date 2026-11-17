import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Poll } from '../types'
import { PollCard } from './PollCard'

const poll: Poll = {
  question: 'Which palette should I ship?',
  options: ['Neon grid', 'Mono grid'],
  votes: [14, 9],
  voterIds: {},
}

describe('PollCard', () => {
  it('shows the question and both options before voting', () => {
    render(<PollCard poll={poll} storyId="s1" currentUserId="u_me" onVote={() => {}} />)
    expect(screen.getByText('Which palette should I ship?')).toBeInTheDocument()
    expect(screen.getByText('Neon grid')).toBeInTheDocument()
    expect(screen.getByText('Mono grid')).toBeInTheDocument()
    expect(screen.getByText(/Tap an option to vote/)).toBeInTheDocument()
  })

  it('calls onVote with the chosen option', () => {
    const onVote = vi.fn()
    render(<PollCard poll={poll} storyId="s1" currentUserId="u_me" onVote={onVote} />)
    fireEvent.click(screen.getByText('Mono grid'))
    expect(onVote).toHaveBeenCalledWith('s1', 1)
  })

  it('shows live percentages after the user voted', () => {
    const voted: Poll = { ...poll, voterIds: { u_me: 0 }, votes: [15, 9] }
    render(<PollCard poll={voted} storyId="s1" currentUserId="u_me" onVote={() => {}} />)
    // 15/24 = 62.5% -> 63% (rounded), 9/24 = 37.5% -> 38%
    expect(screen.getByText(/63%/)).toBeInTheDocument()
    expect(screen.getByText(/38%/)).toBeInTheDocument()
    expect(screen.getByText(/Thanks for voting/)).toBeInTheDocument()
  })
})
