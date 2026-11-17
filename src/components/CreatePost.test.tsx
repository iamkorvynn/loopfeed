import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { getState, resetState } from '../store/store'
import { CreatePost } from './CreatePost'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('CreatePost', () => {
  it('requires a caption before sharing', () => {
    const onCreated = vi.fn()
    render(<CreatePost onCreated={onCreated} />)
    fireEvent.click(screen.getByText('Share post'))
    expect(screen.getByText('Write a caption first.')).toBeInTheDocument()
    expect(onCreated).not.toHaveBeenCalled()
  })

  it('requires a series name when the Loop box is ticked', () => {
    const onCreated = vi.fn()
    render(<CreatePost onCreated={onCreated} />)
    fireEvent.change(screen.getByPlaceholderText("What's happening in this one?"), {
      target: { value: 'day one!' },
    })
    fireEvent.click(screen.getByText(/part of a Loop/))
    fireEvent.click(screen.getByText('Share post'))
    expect(screen.getByText(/Give your Loop a series name/)).toBeInTheDocument()
    expect(onCreated).not.toHaveBeenCalled()
  })

  it('shares a plain post and reports its id', () => {
    const onCreated = vi.fn()
    const before = getState().posts.length
    render(<CreatePost onCreated={onCreated} />)
    fireEvent.change(screen.getByPlaceholderText("What's happening in this one?"), {
      target: { value: 'hello loopfeed' },
    })
    fireEvent.click(screen.getByText('Share post'))
    expect(onCreated).toHaveBeenCalledTimes(1)
    expect(getState().posts.length).toBe(before + 1)
    expect(getState().posts[0].caption).toBe('hello loopfeed')
  })

  it('shares a Loop post with day/total', () => {
    const onCreated = vi.fn()
    render(<CreatePost onCreated={onCreated} />)
    fireEvent.change(screen.getByPlaceholderText("What's happening in this one?"), {
      target: { value: 'day 2!' },
    })
    fireEvent.click(screen.getByText(/part of a Loop/))
    fireEvent.change(screen.getByPlaceholderText('e.g. 7 days of sketches'), {
      target: { value: '7 days of sketches' },
    })
    fireEvent.click(screen.getByText('Share post'))
    expect(onCreated).toHaveBeenCalledTimes(1)
    expect(getState().posts[0].loop).toEqual({ series: '7 days of sketches', day: 1, total: 7 })
  })
})
