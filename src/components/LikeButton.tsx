import { toggleLike } from '../store/store'

interface LikeButtonProps {
  postId: string
  liked: boolean
  count: number
}

/** Heart button: filled when liked, shows the like count. */
export function LikeButton({ postId, liked, count }: LikeButtonProps) {
  return (
    <button
      type="button"
      className={`icon-btn${liked ? ' icon-btn--active' : ''}`}
      aria-label={liked ? 'Unlike this post' : 'Like this post'}
      aria-pressed={liked}
      onClick={() => toggleLike(postId)}
    >
      <span aria-hidden="true">{liked ? '❤️' : '🤍'}</span>
      <span className="icon-btn-count">{count}</span>
    </button>
  )
}
