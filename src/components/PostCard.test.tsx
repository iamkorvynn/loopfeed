import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { PostCard } from './PostCard'

const NOW = Date.now()

beforeEach(() => {
  localStorage.clear()
  resetState(NOW)
})

/** PostCard takes state as a prop; after a store action, re-render with the
 *  fresh store state — exactly what the App shell does via useStore. */
function renderCard(postId: string) {
  const s = getState()
  const post = s.posts.find((p) => p.id === postId)!
  return render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
}

describe('PostCard', () => {
  it('renders the author, caption and like count', () => {
    const s = buildSeedState(NOW)
    const post = s.posts.find((p) => p.id === 'p_mara_clay_12')!
    render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
    expect(screen.getByText(/Day 12 of 30 days of clay/)).toBeInTheDocument()
    // Seed already has me in this post's likeIds, so it shows as liked.
    expect(screen.getByLabelText('Unlike this post')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('shows the Loop ring for Loop posts', () => {
    const s = buildSeedState(NOW)
    const post = s.posts.find((p) => p.id === 'p_mara_clay_12')!
    render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
    expect(screen.getByLabelText('30 days of clay: day 12 of 30')).toBeInTheDocument()
  })

  it('liking via the heart button toggles the label', () => {
    // p_finn_sunrise is not liked by me in the seed.
    const { rerender } = renderCard('p_finn_sunrise')
    fireEvent.click(screen.getByLabelText('Like this post'))
    const s = getState()
    rerender(
      <PostCard post={s.posts.find((p) => p.id === 'p_finn_sunrise')!} state={s} onOpenProfile={() => {}} />,
    )
    expect(screen.getByLabelText('Unlike this post')).toBeInTheDocument()
  })

  it('double-clicking the image likes the post', () => {
    const { rerender } = renderCard('p_finn_sunrise')
    const media = screen.getByLabelText('Post image, double-click to like')
    fireEvent.click(media)
    fireEvent.click(media)
    const s = getState()
    rerender(
      <PostCard post={s.posts.find((p) => p.id === 'p_finn_sunrise')!} state={s} onOpenProfile={() => {}} />,
    )
    expect(screen.getByLabelText('Unlike this post')).toBeInTheDocument()
  })
})

describe('PostCard plain posts', () => {
  it('shows no Loop ring for a post without a loop', () => {
    const s = buildSeedState(Date.now())
    const post = s.posts.find((p) => p.id === 'p_june_stairs')!
    render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
    expect(document.querySelector('.loop-ring')).toBeNull()
    expect(screen.queryByText(/Loop ·/)).not.toBeInTheDocument()
  })
})
