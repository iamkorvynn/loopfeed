import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { buildSeedState } from '../data/seed'
import { getState, resetState } from '../store/store'
import { MessagesView } from './MessagesView'

beforeEach(() => {
  localStorage.clear()
  resetState(Date.now())
})

function renderMessages(activeThreadId = 't_mara') {
  const s = buildSeedState(Date.now())
  return render(
    <MessagesView
      state={s}
      activeThreadId={activeThreadId}
      onSelectThread={() => {}}
      onOpenProfile={() => {}}
      onStarted={() => {}}
    />,
  )
}

describe('MessagesView', () => {
  it('lists threads with the other person and an unread badge', () => {
    renderMessages()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByLabelText(/Conversation with mara.makes, 1 unread/)).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows the active thread messages', () => {
    renderMessages('t_mara')
    expect(screen.getByText(/kiln opens at 6/)).toBeInTheDocument()
    // The last message shows in the thread preview AND in the chat log.
    expect(screen.getAllByText(/it fires brown/).length).toBe(2)
  })

  it('sending a message appends it to the thread', () => {
    renderMessages('t_theo')
    const input = screen.getByLabelText('Write a message')
    fireEvent.change(input, { target: { value: 'neon forever' } })
    fireEvent.click(screen.getByText('Send'))
    const thread = getState().threads.find((t) => t.id === 't_theo')!
    expect(thread.messages[thread.messages.length - 1].text).toBe('neon forever')
  })

  it('shows an empty state when no thread is selected', () => {
    const s = buildSeedState(Date.now())
    render(
      <MessagesView
        state={s}
        activeThreadId={undefined}
        onSelectThread={() => {}}
        onOpenProfile={() => {}}
        onStarted={() => {}}
      />,
    )
    expect(screen.getByText('Pick a conversation')).toBeInTheDocument()
  })

  it('selecting a thread calls onSelectThread', () => {
    const onSelect = vi.fn()
    const s = buildSeedState(Date.now())
    render(
      <MessagesView
        state={s}
        activeThreadId="t_mara"
        onSelectThread={onSelect}
        onOpenProfile={() => {}}
        onStarted={() => {}}
      />,
    )
    fireEvent.click(screen.getByLabelText(/Conversation with theo.frames/))
    expect(onSelect).toHaveBeenCalledWith('t_theo')
  })
})
