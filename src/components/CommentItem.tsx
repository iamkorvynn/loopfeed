import type { CommentItem as CommentItemType, User } from '../types'
import { Avatar } from './Avatar'
import { timeAgo } from '../utils/format'

interface CommentItemProps {
  comment: CommentItemType
  author?: User
}

export function CommentItem({ comment, author }: CommentItemProps) {
  if (!author) return null
  return (
    <li className="comment-item">
      <Avatar username={author.username} artStyle={author.artStyle} artSeed={author.artSeed} size={28} />
      <span className="comment-body">
        <strong>{author.username}</strong> {comment.text}
        <span className="comment-time">{timeAgo(comment.createdAt)}</span>
      </span>
    </li>
  )
}
