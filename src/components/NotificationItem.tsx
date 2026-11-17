import type { AppNotification, ArtStyle } from '../types'
import { Avatar } from './Avatar'
import { timeAgo } from '../utils/format'

interface NotificationItemProps {
  notification: AppNotification
  actorUsername: string
  actorStyle: ArtStyle
  actorSeed: number
  onOpenPost?: (postId: string) => void
}

const ICON: Record<AppNotification['type'], string> = {
  like: '❤️',
  comment: '💬',
  follow: '➕',
  mention: '📣',
  loop: '⟳',
}

/** One row in the notifications list. */
export function NotificationItem({ notification, actorUsername, actorStyle, actorSeed, onOpenPost }: NotificationItemProps) {
  const inner = (
    <>
      <Avatar username={actorUsername} artStyle={actorStyle} artSeed={actorSeed} size={40} />
      <span className="notif-text">
        <span className="notif-icon" aria-hidden="true">{ICON[notification.type]}</span>
        <strong>{actorUsername}</strong> {notification.text}
        <span className="notif-time">{timeAgo(notification.createdAt)}</span>
      </span>
      {!notification.read && <span className="notif-dot" aria-label="Unread notification" />}
    </>
  )
  if (notification.postId && onOpenPost) {
    return (
      <li className={`notif-item${notification.read ? '' : ' notif-item--unread'}`}>
        <button type="button" className="notif-btn" onClick={() => onOpenPost(notification.postId as string)}>
          {inner}
        </button>
      </li>
    )
  }
  return <li className={`notif-item${notification.read ? '' : ' notif-item--unread'}`}>{inner}</li>
}
