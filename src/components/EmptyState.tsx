interface EmptyStateProps {
  title: string
  body: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark" aria-hidden="true">◐</div>
      <h2>{title}</h2>
      <p>{body}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
