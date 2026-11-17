import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { resetState } from '../store/store'
import { ProfileView } from './ProfileView'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('ProfileView', () => {
  it('shows username, bio and stats for another user', () => {
    const s = buildSeedState(Date.now())
    render(<ProfileView userId="u_mara" state={s} onOpenPost={() => {}} onMessage={() => {}} onOpenProfile={() => {}} />)
    expect(screen.getByText('mara.makes')).toBeInTheDocument()
    expect(screen.getByText(/Ceramics, glaze tests/)).toBeInTheDocument()
    // Mara has 2 posts, 4 followers, follows 3 people.
    const stats = screen.getByText(/posts/).closest('p')?.textContent ?? ''
    expect(stats).toContain('2')
    expect(stats).toContain('4')
    // I already follow Mara in the seed, so the button says Following.
    expect(screen.getByText('Following')).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()
  })

  it('shows Edit profile on your own profile', () => {
    const s = buildSeedState(Date.now())
    render(<ProfileView userId="u_me" state={s} onOpenPost={() => {}} onMessage={() => {}} onOpenProfile={() => {}} />)
    expect(screen.getByText('Edit profile')).toBeInTheDocument()
    expect(screen.queryByText('Follow')).not.toBeInTheDocument()
  })

  it('Saved tab shows bookmarked posts on your own profile', () => {
    const s = buildSeedState(Date.now())
    render(<ProfileView userId="u_me" state={s} onOpenPost={() => {}} onMessage={() => {}} onOpenProfile={() => {}} />)
    fireEvent.click(screen.getByText(/Saved/))
    // I saved 5 posts in the seed
    expect(document.querySelectorAll('.explore-tile').length).toBe(5)
  })

  it('shows an empty state for a user with no posts on the tab', () => {
    const s = buildSeedState(Date.now())
    s.posts = s.posts.filter((p) => p.userId !== 'u_finn')
    render(<ProfileView userId="u_finn" state={s} onOpenPost={() => {}} onMessage={() => {}} onOpenProfile={() => {}} />)
    expect(screen.getByText('No posts yet')).toBeInTheDocument()
  })
})
