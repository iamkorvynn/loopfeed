import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { getState, resetState } from '../store/store'
import { CreatePost } from './CreatePost'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('CreatePost upload validation', () => {
  it('rejects a non-image file', () => {
    render(<CreatePost onCreated={() => {}} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.getByText('That file is not an image.')).toBeInTheDocument()
  })

  it('rejects an image over 2 MB', () => {
    render(<CreatePost onCreated={() => {}} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const big = new File([new ArrayBuffer(2_000_001)], 'big.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [big] } })
    expect(screen.getByText(/too big/)).toBeInTheDocument()
  })

  it('accepts a small image and stores it as the post art', async () => {
    const onCreated = vi.fn()
    render(<CreatePost onCreated={onCreated} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'art.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })
    // FileReader is async; wait for the preview img to appear.
    expect(await screen.findByAltText('Preview of your post artwork')).toBeInTheDocument()
    fireEvent.change(screen.getByPlaceholderText("What's happening in this one?"), {
      target: { value: 'uploaded!' },
    })
    fireEvent.click(screen.getByText('Share post'))
    expect(onCreated).toHaveBeenCalled()
    expect(getState().posts[0].caption).toBe('uploaded!')
  })
})
