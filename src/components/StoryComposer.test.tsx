import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { getState, resetState } from '../store/store'
import { StoryComposer } from './StoryComposer'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('StoryComposer', () => {
  it('requires a caption', () => {
    render(<StoryComposer onPosted={() => {}} onCancel={() => {}} />)
    fireEvent.click(screen.getByText('Post story'))
    expect(screen.getByText(/Write a caption for your story/)).toBeInTheDocument()
  })

  it('requires a full poll when the box is ticked', () => {
    render(<StoryComposer onPosted={() => {}} onCancel={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText("What's happening?"), { target: { value: 'voting time' } })
    fireEvent.click(screen.getByText(/Ask a poll question/))
    fireEvent.click(screen.getByText('Post story'))
    expect(screen.getByText(/A poll needs a question and both options/)).toBeInTheDocument()
  })

  it('posts a story with a poll and opens it', () => {
    const onPosted = vi.fn()
    const before = getState().stories.length
    render(<StoryComposer onPosted={onPosted} onCancel={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText("What's happening?"), { target: { value: 'pick a glaze' } })
    fireEvent.click(screen.getByText(/Ask a poll question/))
    fireEvent.change(screen.getByPlaceholderText('e.g. Which one should I ship?'), { target: { value: 'which glaze?' } })
    fireEvent.change(screen.getByLabelText('Option 1'), { target: { value: 'Pink' } })
    fireEvent.change(screen.getByLabelText('Option 2'), { target: { value: 'Brown' } })
    fireEvent.click(screen.getByText('Post story'))
    expect(getState().stories.length).toBe(before + 1)
    expect(getState().stories[0].poll?.question).toBe('which glaze?')
    expect(onPosted).toHaveBeenCalledWith('u_me')
  })

  it('cancel calls onCancel without posting', () => {
    const onCancel = vi.fn()
    const before = getState().stories.length
    render(<StoryComposer onPosted={() => {}} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalled()
    expect(getState().stories.length).toBe(before)
  })
})
