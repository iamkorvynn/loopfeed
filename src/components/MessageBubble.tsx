import type { ChatMessage } from '../types'
import { timeAgo } from '../utils/format'

interface MessageBubbleProps {
  message: ChatMessage
  isMine: boolean
}

/** One chat bubble; mine on the right, theirs on the left, with a time + read tick. */
export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <div className={`msg-bubble-row${isMine ? ' msg-bubble-row--mine' : ''}`}>
      <div className={`msg-bubble${isMine ? ' msg-bubble--mine' : ''}`}>
        <span>{message.text}</span>
        <span className="msg-meta">
          {timeAgo(message.createdAt)}
          {isMine && (message.read ? ' ✓✓' : ' ✓')}
        </span>
      </div>
    </div>
  )
}
