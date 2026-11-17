import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { PostCard } from './PostCard'

const NOW = Date.UTC(2026, 10, 18, 2, 0, 0)

beforeEach(() => {
  localStorage.clear()
  resetState(NOW)
})

describe('PostCard', () => {
  it('renders the author, caption and like count', () => {
    const s = buildSeedState(NOW)
    const post = s.posts.find((p) => p.id === 'p_mara_clay_12')!
    render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
    expect(screen.getByText(/Day 12 of 30 days of clay/)).toBeInTheDocument()
    expect(screen.getByLabelText('Like this post')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('shows the Loop ring for Loop posts', () => {
    const s = buildSeedState(NOW)
    const post = s.posts.find((p) => p.id === 'p_mara_clay_12')!
    render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
    expect(screen.getByLabelText('30 days of clay: day 12 of 30')).toBeInTheDocument()
  })

  it('liking via the heart button toggles the label', () => {
    const s = buildSeedState(NOW)
    const post = s.posts.find((p) => p.id === 'p_june_stairs')!
    render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
    const btn = screen.getByLabelText('Like this post')
    fireEvent.click(btn)
    expect(screen.getByLabelText('Unlike this post')).toBeInTheDocument()
  })

  it('double-clicking the image likes the post', () => {
    const s = buildSeedState(NOW)
    const post = s.posts.find((p) => p.id === 'p_june_stairs')!
    render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
    const media = screen.getByLabelText('Post image, double-click to like')
    fireEvent.click(media)
    fireEvent.click(media)
    expect(screen.getByLabelText('Unlike this post')).toBeInTheDocument()
  })
})
