/** Read-only derived views over AppState. Pure functions, unit-tested. */
import type { AppState, Post, Story, Thread, User } from '../types'
import { isStoryExpired } from './store'

export function followersOf(s: AppState, userId: string): User[] {
  return s.users.filter((u) => u.following.includes(userId))
}

export function followingOf(s: AppState, userId: string): User[] {
  const me = s.users.find((u) => u.id === userId)
  if (!me) return []
  return me.following
    .map((id) => s.users.find((u) => u.id === id))
    .filter((u): u is User => Boolean(u))
}

export function postsByUser(s: AppState, userId: string): Post[] {
  return s.posts
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function savedPosts(s: AppState, userId: string): Post[] {
  return s.posts
    .filter((p) => p.saveIds.includes(userId))
    .sort((a, b) => b.createdAt - a.createdAt)
}

/** Feed = own posts + posts from people you follow, newest first. */
export function feedPosts(s: AppState): Post[] {
  const me = s.users.find((u) => u.id === s.currentUserId)
  const visible = new Set<string>([s.currentUserId, ...(me?.following ?? [])])
  return s.posts
    .filter((p) => visible.has(p.userId))
    .sort((a, b) => b.createdAt - a.createdAt)
}

/** Explore = everything, most-liked first, then newest. */
export function explorePosts(s: AppState): Post[] {
  return [...s.posts].sort(
    (a, b) => b.likeIds.length - a.likeIds.length || b.createdAt - a.createdAt,
  )
}

/** Only non-expired stories, grouped per user, most recent story first. */
export function liveStories(s: AppState, now: number = Date.now()): Story[] {
  return s.stories
    .filter((st) => !isStoryExpired(st, now))
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function storiesByUser(
  s: AppState,
  userId: string,
  now: number = Date.now(),
): Story[] {
  return liveStories(s, now)
    .filter((st) => st.userId === userId)
    .sort((a, b) => a.createdAt - b.createdAt)
}

export function commentsForPost(s: AppState, postId: string) {
  return s.comments
    .filter((c) => c.postId === postId)
    .sort((a, b) => a.createdAt - b.createdAt)
}

/** Threads sorted by latest message, newest first. */
export function sortedThreads(s: AppState): Thread[] {
  const last = (t: Thread) => t.messages[t.messages.length - 1]?.createdAt ?? 0
  return [...s.threads].sort((a, b) => last(b) - last(a))
}

/** Unread DM count for the current user across all threads. */
export function unreadDmCount(s: AppState): number {
  let n = 0
  for (const t of s.threads) {
    for (const m of t.messages) {
      if (m.senderId !== s.currentUserId && !m.read) n += 1
    }
  }
  return n
}

export function unreadNotificationCount(s: AppState): number {
  return s.notifications.filter((n) => !n.read).length
}

export function otherParticipant(s: AppState, thread: Thread): User | undefined {
  const otherId = thread.participantIds.find((id) => id !== s.currentUserId)
  return s.users.find((u) => u.id === otherId)
}

/** Case-insensitive search over usernames, display names, bios and captions. */
export function searchAll(
  s: AppState,
  query: string,
): { users: User[]; posts: Post[] } {
  const q = query.trim().toLowerCase()
  if (!q) return { users: [], posts: [] }
  const users = s.users.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q),
  )
  const posts = s.posts.filter(
    (p) =>
      p.caption.toLowerCase().includes(q) ||
      (p.loop?.series.toLowerCase().includes(q) ?? false),
  )
  return { users, posts }
}

/** People you don't follow yet, for the "suggested for you" rail. */
export function suggestedUsers(s: AppState, limit = 4): User[] {
  const me = s.users.find((u) => u.id === s.currentUserId)
  if (!me) return []
  return s.users
    .filter((u) => u.id !== me.id && !me.following.includes(u.id))
    .slice(0, limit)
}
