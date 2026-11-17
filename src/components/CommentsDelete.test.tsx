import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { CommentsSection } from './CommentsSection'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('CommentsSection delete', () => {
  it('shows a delete button on my own comment and removes it', () => {
    const s = buildSeedState(Date.now())
    const { rerender } = render(<CommentsSection postId="p_theo_gen_41" state={s} />)
    fireEvent.click(screen.getByText(/View all 1 comment/))
    // My comment on Theo's post is the only one; it is deletable.
    expect(screen.getByLabelText('Delete this comment')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Delete this comment'))
    const fresh = getState()
    rerender(<CommentsSection postId="p_theo_gen_41" state={fresh} />)
    expect(screen.getByText(/Be the first to comment/)).toBeInTheDocument()
  })

  it('shows no delete button on other people’s comments', () => {
    const s = buildSeedState(Date.now())
    render(<CommentsSection postId="p_me_sketch_4" state={s} />)
    fireEvent.click(screen.getByText(/View all 2 comments/))
    expect(screen.queryByLabelText('Delete this comment')).not.toBeInTheDocument()
  })
})
