import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoopBadge } from './LoopBadge'

describe('LoopBadge', () => {
  it('renders day/total for the series', () => {
    render(<LoopBadge loop={{ series: '30 days of clay', day: 12, total: 30 }} />)
    expect(screen.getByText('⟳ 12/30')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Loop 30 days of clay, day 12 of 30'),
    ).toBeInTheDocument()
  })
})
