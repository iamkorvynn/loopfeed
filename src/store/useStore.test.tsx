import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { resetState, toggleLike } from './store'
import { useStore } from './useStore'

function Probe({ postId }: { postId: string }) {
  const state = useStore()
  const post = state.posts.find((p) => p.id === postId)!
  return <span data-testid="like-count">{post.likeIds.length}</span>
}

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('useStore', () => {
  it('re-renders subscribers when the store changes', () => {
    render(<Probe postId="p_finn_sunrise" />)
    expect(screen.getByTestId('like-count')).toHaveTextContent('2')
    act(() => {
      toggleLike('p_finn_sunrise')
    })
    expect(screen.getByTestId('like-count')).toHaveTextContent('3')
  })
})
