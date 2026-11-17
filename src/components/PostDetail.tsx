import type { AppState } from '../types'
import { PostCard } from './PostCard'

interface PostDetailProps {
  postId: string
  state: AppState
  onBack: () => void
  onOpenProfile: (userId: string) => void
}

/** Single-post detail view (from Explore, Search or a notification). */
export function PostDetail({ postId, state, onBack, onOpenProfile }: PostDetailProps) {
  const post = state.posts.find((p) => p.id === postId)
  if (!post) {
    return (
      <div className="post-detail">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Back
        </button>
        <p className="search-hint">That post is gone — it may have been removed.</p>
      </div>
    )
  }
  return (
    <div className="post-detail">
      <button type="button" className="btn btn--ghost" onClick={onBack}>
        ← Back
      </button>
      <PostCard post={post} state={state} onOpenProfile={onOpenProfile} />
    </div>
  )
}
