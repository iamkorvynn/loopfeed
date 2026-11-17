import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { EditProfile } from './EditProfile'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('EditProfile', () => {
  it('saves a new display name and bio', () => {
    const s = buildSeedState(Date.now())
    const onDone = vi.fn()
    render(<EditProfile state={s} onDone={onDone} />)
    const nameInput = screen.getByDisplayValue('You')
    fireEvent.change(nameInput, { target: { value: 'Loop Fan' } })
    fireEvent.click(screen.getByText('Save'))
    expect(getState().users.find((u) => u.id === 'u_me')!.displayName).toBe('Loop Fan')
    expect(onDone).toHaveBeenCalled()
  })

  it('rejects an empty display name', () => {
    const s = buildSeedState(Date.now())
    render(<EditProfile state={s} onDone={() => {}} />)
    fireEvent.change(screen.getByDisplayValue('You'), { target: { value: '   ' } })
    fireEvent.click(screen.getByText('Save'))
    expect(screen.getByText('Display name cannot be empty.')).toBeInTheDocument()
    expect(getState().users.find((u) => u.id === 'u_me')!.displayName).toBe('You')
  })

  it('cancel calls onDone without saving', () => {
    const s = buildSeedState(Date.now())
    const onDone = vi.fn()
    render(<EditProfile state={s} onDone={onDone} />)
    fireEvent.change(screen.getByDisplayValue('You'), { target: { value: 'Changed' } })
    fireEvent.click(screen.getByText('Cancel'))
    expect(onDone).toHaveBeenCalled()
    expect(getState().users.find((u) => u.id === 'u_me')!.displayName).toBe('You')
  })
})
