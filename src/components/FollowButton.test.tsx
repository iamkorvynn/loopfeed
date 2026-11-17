import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { getState, resetState, toggleFollow } from '../store/store'
import { FollowButton } from './FollowButton'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('FollowButton', () => {
  it('shows Follow when not following, Following after click', () => {
    render(<FollowButton targetUserId="u_noor" following={false} />)
    expect(screen.getByText('Follow')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Follow'))
    expect(getState().users.find((u) => u.id === 'u_me')!.following).toContain('u_noor')
  })

  it('renders nothing for your own profile', () => {
    const { container } = render(<FollowButton targetUserId="u_me" following={false} isSelf />)
    expect(container).toBeEmptyDOMElement()
  })

  it('reflects the store after toggling twice', () => {
    render(<FollowButton targetUserId="u_noor" following={false} />)
    toggleFollow('u_noor')
    toggleFollow('u_noor')
    expect(getState().users.find((u) => u.id === 'u_me')!.following).not.toContain('u_noor')
  })
})
