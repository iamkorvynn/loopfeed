import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NavBar } from './NavBar'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('NavBar', () => {
  it('shows unread badges on messages and notifications', () => {
    render(
      <NavBar view="feed" onNavigate={() => {}} unreadDms={3} unreadNotifs={2} onResetDemo={() => {}} />,
    )
    expect(screen.getByLabelText('3 unread messages')).toBeInTheDocument()
    expect(screen.getByLabelText('2 unread notifications')).toBeInTheDocument()
  })

  it('hides badges when there is nothing unread', () => {
    render(
      <NavBar view="feed" onNavigate={() => {}} unreadDms={0} unreadNotifs={0} onResetDemo={() => {}} />,
    )
    expect(screen.queryByLabelText(/unread/)).not.toBeInTheDocument()
  })

  it('navigates when a nav item is clicked', () => {
    const onNavigate = vi.fn()
    render(
      <NavBar view="feed" onNavigate={onNavigate} unreadDms={0} unreadNotifs={0} onResetDemo={() => {}} />,
    )
    fireEvent.click(screen.getByText(/Explore/))
    expect(onNavigate).toHaveBeenCalledWith('explore')
  })

  it('toggles dark mode and persists it', () => {
    render(
      <NavBar view="feed" onNavigate={() => {}} unreadDms={0} unreadNotifs={0} onResetDemo={() => {}} />,
    )
    fireEvent.click(screen.getByLabelText('Switch to dark mode'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('loopfeed-theme')).toBe('dark')
    fireEvent.click(screen.getByLabelText('Switch to light mode'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
