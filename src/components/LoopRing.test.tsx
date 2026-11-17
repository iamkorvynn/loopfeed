import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoopRing } from './LoopRing'

describe('LoopRing', () => {
  it('renders day/total text', () => {
    render(<LoopRing day={12} total={30} series="30 days of clay" />)
    expect(screen.getByText('12/30')).toBeInTheDocument()
  })

  it('labels the ring for screen readers', () => {
    render(<LoopRing day={1} total={7} series="7 days of sketches" />)
    expect(screen.getByLabelText('7 days of sketches: day 1 of 7')).toBeInTheDocument()
  })

  it('clamps the ring at 100% when day exceeds total', () => {
    const { container } = render(<LoopRing day={9} total={7} series="overflow" />)
    const progress = container.querySelector('circle[stroke-dashoffset]')
    expect(progress?.getAttribute('stroke-dashoffset')).toBe('0')
  })
})
