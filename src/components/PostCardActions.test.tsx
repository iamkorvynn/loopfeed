import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { PostCard } from './PostCard'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  })
})

function renderCard(postId: string) {
  const s = getState()
  const post = s.posts.find((p) => p.id === postId)!
  return render(<PostCard post={post} state={s} onOpenProfile={() => {}} />)
}

describe('PostCard copy link and save', () => {
  it('copies the post link and shows Copied feedback', async () => {
    renderCard('p_mara_clay_12')
    fireEvent.click(screen.getByLabelText('Copy link to this post'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('/post/p_mara_clay_12'),
    )
    expect(await screen.findByText('Copied')).toBeInTheDocument()
  })

  it('toggles save via the bookmark button', () => {
    const { rerender } = renderCard('p_theo_gen_41')
    fireEvent.click(screen.getByLabelText('Save this post'))
    const s = getState()
    rerender(
      <PostCard post={s.posts.find((p) => p.id === 'p_theo_gen_41')!} state={s} onOpenProfile={() => {}} />,
    )
    expect(screen.getByLabelText('Remove from saved')).toBeInTheDocument()
  })
})
