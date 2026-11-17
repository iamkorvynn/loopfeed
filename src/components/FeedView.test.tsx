import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { FeedView } from './FeedView'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('FeedView', () => {
  it('renders stories, posts and the caught-up footer', () => {
    const s = buildSeedState(Date.now())
    render(
      <FeedView
        state={s}
        onOpenProfile={() => {}}
        onOpenStory={() => {}}
        onGoExplore={() => {}}
      />,
    )
    expect(screen.getByLabelText(/theo.frames's story/)).toBeInTheDocument()
    expect(screen.getByText(/Day 12 of 30 days of clay/)).toBeInTheDocument()
    expect(screen.getByText(/all caught up/)).toBeInTheDocument()
    // Side heading + one "Suggested for you" note per suggested user (3).
    expect(screen.getAllByText('Suggested for you').length).toBe(4)
  })

  it('opens the story composer from the button', () => {
    const s = buildSeedState(Date.now())
    render(
      <FeedView
        state={s}
        onOpenProfile={() => {}}
        onOpenStory={() => {}}
        onGoExplore={() => {}}
      />,
    )
    fireEvent.click(screen.getByText(/Post a story/))
    expect(screen.getByText('Stories disappear after 24 hours.')).toBeInTheDocument()
  })

  it('shows the empty state when the feed has no posts', () => {
    const s = buildSeedState(Date.now())
    s.posts = []
    const onExplore = vi.fn()
    render(
      <FeedView
        state={s}
        onOpenProfile={() => {}}
        onOpenStory={() => {}}
        onGoExplore={onExplore}
      />,
    )
    expect(screen.getByText('Your feed is empty')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Explore posts'))
    expect(onExplore).toHaveBeenCalled()
  })
})
