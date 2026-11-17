import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { CommentsSection } from './CommentsSection'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('CommentsSection', () => {
  it('shows the comment count toggle', () => {
    const s = buildSeedState(Date.now())
    render(<CommentsSection postId="p_me_sketch_4" state={s} />)
    expect(screen.getByText(/View all 2 comments/)).toBeInTheDocument()
  })

  it('expands to show comments and adds a new one', () => {
    const s = buildSeedState(Date.now())
    const { rerender } = render(<CommentsSection postId="p_me_sketch_4" state={s} />)
    fireEvent.click(screen.getByText(/View all 2 comments/))
    expect(screen.getByText(/hands ARE hard/)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Add a comment'), { target: { value: 'day 5 will be better' } })
    fireEvent.click(screen.getByText('Post'))
    const fresh = getState()
    rerender(<CommentsSection postId="p_me_sketch_4" state={fresh} />)
    expect(screen.getByText(/day 5 will be better/)).toBeInTheDocument()
  })

  it('does not post an empty comment', () => {
    const s = buildSeedState(Date.now())
    render(<CommentsSection postId="p_me_sketch_4" state={s} />)
    expect(screen.getByText('Post')).toBeDisabled()
    expect(getState().comments.filter((c) => c.postId === 'p_me_sketch_4').length).toBe(2)
  })
})
