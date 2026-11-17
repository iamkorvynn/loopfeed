import { toggleSave } from '../store/store'

interface SaveButtonProps {
  postId: string
  saved: boolean
}

/** Bookmark button for saving a post to your profile's Saved tab. */
export function SaveButton({ postId, saved }: SaveButtonProps) {
  return (
    <button
      type="button"
      className={`icon-btn${saved ? ' icon-btn--active' : ''}`}
      aria-label={saved ? 'Remove from saved' : 'Save this post'}
      aria-pressed={saved}
      onClick={() => toggleSave(postId)}
    >
      <span aria-hidden="true">{saved ? '🔖' : '📑'}</span>
    </button>
  )
}
