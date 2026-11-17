import type { CommentItem as CommentItemType, User } from '../types'
import { deleteComment } from '../store/store'
import { Avatar } from './Avatar'
import { timeAgo } from '../utils/format'

interface CommentItemProps {
  comment: CommentItemType
  author?: User
  currentUserId: string
}

export function CommentItem({ comment, author, currentUserId }: CommentItemProps) {
  if (!author) return null
  const canDelete = comment.userId === currentUserId
  return (
    <li className="comment-item">
      <Avatar username={author.username} artStyle={author.artStyle} artSeed={author.artSeed} size={28} />
      <span className="comment-body">
        <strong>{author.username}</strong> {comment.text}
        <span className="comment-time">{timeAgo(comment.createdAt)}</span>
      </span>
      {canDelete && (
        <button
          type="button"
          className="comment-delete"
          aria-label="Delete this comment"
          onClick={() => deleteComment(comment.id)}
        >
          ✕
        </button>
      )}
    </li>
  )
}
