import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { getState, resetState } from './store/store'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('App reset demo and create flow', () => {
  it('reset demo asks for confirmation and reseeds', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)
    // Like my own Day 4 sketch post first so the reseed is observable.
    const likeBtn = screen.getAllByLabelText('Like this post')[0]
    fireEvent.click(likeBtn)
    expect(getState().posts.find((p) => p.id === 'p_me_sketch_4')?.likeIds).toContain('u_me')
    fireEvent.click(screen.getByText('Reset demo'))
    expect(confirm).toHaveBeenCalled()
    expect(getState().posts.find((p) => p.id === 'p_me_sketch_4')?.likeIds).not.toContain('u_me')
    confirm.mockRestore()
  })

  it('reset demo does nothing when cancelled', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<App />)
    fireEvent.click(screen.getAllByLabelText('Like this post')[0])
    fireEvent.click(screen.getByText('Reset demo'))
    expect(confirm).toHaveBeenCalled()
    expect(getState().posts.find((p) => p.id === 'p_me_sketch_4')?.likeIds).toContain('u_me')
    confirm.mockRestore()
  })

  it('create flow lands on the new post detail', () => {
    render(<App />)
    fireEvent.click(screen.getByText(/Create/))
    fireEvent.change(screen.getByPlaceholderText("What's happening in this one?"), {
      target: { value: 'my first loopfeed post' },
    })
    fireEvent.click(screen.getByText('Share post'))
    expect(screen.getByText('← Back')).toBeInTheDocument()
    expect(screen.getByText(/my first loopfeed post/)).toBeInTheDocument()
  })
})
