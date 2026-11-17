import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { PostDetail } from './PostDetail'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('PostDetail', () => {
  it('renders the post with a back button', () => {
    const s = buildSeedState(Date.now())
    const onBack = vi.fn()
    render(
      <PostDetail postId="p_theo_gen_41" state={s} onBack={onBack} onOpenProfile={() => {}} />,
    )
    expect(screen.getByText(/Day 41 \/ 100/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('← Back'))
    expect(onBack).toHaveBeenCalled()
  })

  it('shows a friendly message for a missing post', () => {
    const s = buildSeedState(Date.now())
    render(
      <PostDetail postId="p_nope" state={s} onBack={() => {}} onOpenProfile={() => {}} />,
    )
    expect(screen.getByText(/That post is gone/)).toBeInTheDocument()
  })
})
