import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { ProfileView } from './ProfileView'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('FollowList via ProfileView', () => {
  it('opens the followers list and closes it', () => {
    const s = buildSeedState(Date.now())
    render(
      <ProfileView
        userId="u_mara"
        state={s}
        onOpenPost={() => {}}
        onMessage={() => {}}
        onOpenProfile={() => {}}
      />,
    )
    fireEvent.click(screen.getByText(/followers/))
    expect(screen.getByLabelText("Mara Voss's followers")).toBeInTheDocument()
    expect(screen.getByText('theo.frames')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText("Close Mara Voss's followers"))
    expect(screen.queryByLabelText("Mara Voss's followers")).not.toBeInTheDocument()
  })

  it('opens the following list and jumps to a profile from it', () => {
    const s = buildSeedState(Date.now())
    const onOpenProfile = vi.fn()
    render(
      <ProfileView
        userId="u_mara"
        state={s}
        onOpenPost={() => {}}
        onMessage={() => {}}
        onOpenProfile={onOpenProfile}
      />,
    )
    fireEvent.click(screen.getByText(/following/))
    expect(screen.getByLabelText('Mara Voss is following')).toBeInTheDocument()
    // Click the user row for Theo inside the list.
    fireEvent.click(screen.getByLabelText("Open theo.frames's profile"))
    expect(onOpenProfile).toHaveBeenCalledWith('u_theo')
  })

  it('Message button calls onMessage with the user id', () => {
    const s = buildSeedState(Date.now())
    const onMessage = vi.fn()
    render(
      <ProfileView
        userId="u_mara"
        state={s}
        onOpenPost={() => {}}
        onMessage={onMessage}
        onOpenProfile={() => {}}
      />,
    )
    fireEvent.click(screen.getByText('Message'))
    expect(onMessage).toHaveBeenCalledWith('u_mara')
  })
})
