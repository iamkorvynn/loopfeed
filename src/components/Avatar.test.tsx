import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoopRing } from './LoopRing'
import { Avatar } from './Avatar'

describe('LoopRing', () => {
  it('labels the series progress accessibly', () => {
    render(<LoopRing day={3} total={7} series="7 days of sketches" />)
    expect(screen.getByLabelText('7 days of sketches: day 3 of 7')).toBeInTheDocument()
    expect(screen.getByText('3/7')).toBeInTheDocument()
  })
})

describe('Avatar', () => {
  it('renders initials from the username', () => {
    const { container } = render(<Avatar username="mara.makes" artStyle="sunset" artSeed={21} />)
    expect(container.querySelector('text')?.textContent).toBe('MM')
  })

  it('has an accessible avatar label', () => {
    render(<Avatar username="theo.frames" artStyle="neon" artSeed={32} />)
    expect(screen.getByLabelText('theo.frames avatar')).toBeInTheDocument()
  })
})
