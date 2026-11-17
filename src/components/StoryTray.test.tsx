import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { StoryTray } from './StoryTray'

const NOW = Date.UTC(2026, 10, 18, 2, 0, 0)

beforeEach(() => {
  localStorage.clear()
  resetState(NOW)
})

describe('StoryTray', () => {
  it('shows one circle per user with a live story', () => {
    const s = buildSeedState(NOW)
    render(<StoryTray state={s} onOpenStory={() => {}} />)
    // 5 live-story users: theo, mara, ravi, june, finn (noor expired)
    expect(screen.getByLabelText(/theo.frames's story/)).toBeInTheDocument()
    expect(screen.getByLabelText(/mara.makes's story/)).toBeInTheDocument()
    expect(screen.queryByLabelText(/noor.lines's story/)).not.toBeInTheDocument()
  })

  it('marks poll stories with a poll in the label', () => {
    const s = buildSeedState(NOW)
    render(<StoryTray state={s} onOpenStory={() => {}} />)
    expect(screen.getByLabelText(/theo.frames's story, includes a poll/)).toBeInTheDocument()
  })
})
