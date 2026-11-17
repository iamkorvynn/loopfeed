import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { resetState } from './store/store'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('App shell', () => {
  it('renders the feed with the brand and stories', () => {
    render(<App />)
    expect(screen.getByText('LoopFeed')).toBeInTheDocument()
    expect(screen.getByLabelText(/theo.frames's story/)).toBeInTheDocument()
    expect(screen.getByText(/Day 12 of 30 days of clay/)).toBeInTheDocument()
  })

  it('navigates to Explore from the nav bar', () => {
    render(<App />)
    fireEvent.click(screen.getByText(/Explore/))
    expect(screen.getByText(/Loops only/)).toBeInTheDocument()
  })

  it('navigates to Messages and shows the unread thread', () => {
    render(<App />)
    fireEvent.click(screen.getByText(/Messages/))
    expect(screen.getByLabelText(/Conversation with mara.makes, 1 unread/)).toBeInTheDocument()
  })

  it('pressing / jumps to search', () => {
    render(<App />)
    fireEvent.keyDown(document.body, { key: '/' })
    expect(screen.getByLabelText('Search LoopFeed')).toBeInTheDocument()
  })

  it('opening a post from Explore shows the detail view', () => {
    render(<App />)
    fireEvent.click(screen.getByText(/Explore/))
    const tiles = document.querySelectorAll('.explore-tile')
    fireEvent.click(tiles[0])
    expect(screen.getByText('← Back')).toBeInTheDocument()
    fireEvent.click(screen.getByText('← Back'))
    expect(screen.getByText(/Loops only/)).toBeInTheDocument()
  })
})

describe('App profile navigation', () => {
  it('clicking a post author opens their profile', () => {
    render(<App />)
    // The first post in the feed is Mara's; its header button opens her profile.
    const authorBtn = document.querySelector('.post-author') as HTMLButtonElement
    fireEvent.click(authorBtn)
    expect(screen.getByText(/Ceramics, glaze tests/)).toBeInTheDocument()
  })
})
