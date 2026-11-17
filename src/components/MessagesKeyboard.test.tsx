import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { MessagesView } from './MessagesView'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

describe('MessagesView keyboard send', () => {
  it('Enter sends the draft message', () => {
    const s = buildSeedState(Date.now())
    render(
      <MessagesView
        state={s}
        activeThreadId="t_june"
        onSelectThread={() => {}}
        onOpenProfile={() => {}}
        onStarted={() => {}}
      />,
    )
    const input = screen.getByLabelText('Write a message')
    fireEvent.change(input, { target: { value: 'see you sunday!' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    const thread = getState().threads.find((t) => t.id === 't_june')!
    expect(thread.messages[thread.messages.length - 1].text).toBe('see you sunday!')
  })

  it('starting a chat with someone new shows the pending composer', () => {
    const s = buildSeedState(Date.now())
    render(
      <MessagesView
        state={s}
        activeThreadId={undefined}
        onSelectThread={() => {}}
        onOpenProfile={() => {}}
        startWithUserId="u_noor"
        onStarted={() => {}}
      />,
    )
    expect(screen.getByText(/Say hi to noor.lines/)).toBeInTheDocument()
    const input = screen.getByLabelText('Write a message')
    fireEvent.change(input, { target: { value: 'hi noor!' } })
    fireEvent.click(screen.getByText('Send'))
    expect(getState().threads.some((t) => t.participantIds.includes('u_noor'))).toBe(true)
  })
})
