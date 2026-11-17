import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { StoryViewer } from './StoryViewer'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('StoryViewer keyboard', () => {
  it('Escape closes the viewer', () => {
    const s = buildSeedState(Date.now())
    let closed = false
    render(
      <StoryViewer
        userId="u_mara"
        state={s}
        onClose={() => {
          closed = true
        }}
        onOpenProfile={() => {}}
      />,
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(closed).toBe(true)
  })

  it('ArrowRight advances to the next story', () => {
    const s = buildSeedState(Date.now())
    // Mara has one story; add a second via the seed so advancing is visible.
    s.stories.push({
      id: 's_mara_2',
      userId: 'u_mara',
      artSeed: 299,
      artStyle: 'sunset',
      caption: 'Second story',
      createdAt: Date.now(),
      viewedBy: [],
    })
    render(
      <StoryViewer userId="u_mara" state={s} onClose={() => {}} onOpenProfile={() => {}} />,
    )
    expect(screen.getByText('Kiln opens at 6pm 🔥')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('Second story')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('Kiln opens at 6pm 🔥')).toBeInTheDocument()
  })
})
