import type { Poll } from '../types'

interface PollCardProps {
  poll: Poll
  storyId: string
  currentUserId: string
  onVote: (storyId: string, option: 0 | 1) => void
}

/** Story poll: two options, tap to vote, live result bars after voting. */
export function PollCard({ poll, storyId, currentUserId, onVote }: PollCardProps) {
  const myVote = poll.voterIds[currentUserId]
  const hasVoted = myVote !== undefined
  const total = poll.votes[0] + poll.votes[1]
  return (
    <div className="poll-card" role="group" aria-label={`Poll: ${poll.question}`}>
      <p className="poll-question">{poll.question}</p>
      <div className="poll-options">
        {poll.options.map((label, i) => {
          const option = i as 0 | 1
          const votes = poll.votes[option]
          const pct = total === 0 ? 0 : Math.round((votes / total) * 100)
          return (
            <button
              key={label}
              type="button"
              className={`poll-option${myVote === option ? ' poll-option--mine' : ''}`}
              onClick={() => onVote(storyId, option)}
              aria-pressed={myVote === option}
            >
              {hasVoted && (
                <span className="poll-bar" style={{ width: `${pct}%` }} aria-hidden="true" />
              )}
              <span className="poll-label">{label}</span>
              {hasVoted && (
                <span className="poll-pct">
                  {pct}% · {votes} vote{votes === 1 ? '' : 's'}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p className="poll-total">
        {hasVoted ? 'Thanks for voting — results update live.' : 'Tap an option to vote.'} ·{' '}
        {total} vote{total === 1 ? '' : 's'} total
      </p>
    </div>
  )
}
