import { useState } from 'react'
import type { AppState, CommentItem as CommentItemType } from '../types'
import { addComment } from '../store/store'
import { commentsForPost } from '../store/selectors'
import { CommentItem } from './CommentItem'

interface CommentsSectionProps {
  postId: string
  state: AppState
  /** Start expanded (used on the post detail / profile view). */
  defaultOpen?: boolean
}

export function CommentsSection({ postId, state, defaultOpen = false }: CommentsSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [draft, setDraft] = useState('')
  const comments: CommentItemType[] = commentsForPost(state, postId)

  const submit = () => {
    const created = addComment(postId, draft)
    if (created) setDraft('')
  }

  return (
    <div className="comments">
      <button
        type="button"
        className="comments-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        💬 {comments.length === 0 ? 'Be the first to comment' : `View all ${comments.length} comment${comments.length === 1 ? '' : 's'}`}
      </button>
      {open && (
        <ul className="comment-list">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              author={state.users.find((u) => u.id === c.userId)}
            />
          ))}
        </ul>
      )}
      <div className="comment-form">
        <input
          type="text"
          value={draft}
          maxLength={500}
          placeholder="Add a comment…"
          aria-label="Add a comment"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
        <button type="button" className="btn btn--primary btn--sm" disabled={!draft.trim()} onClick={submit}>
          Post
        </button>
      </div>
    </div>
  )
}
