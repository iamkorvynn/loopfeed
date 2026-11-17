/** Core domain types for LoopFeed. All demo data lives in localStorage; no backend. */

export type ArtStyle =
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'neon'
  | 'mono'
  | 'candy'
  | 'dusk'
  | 'geo'

export interface User {
  id: string
  username: string
  displayName: string
  bio: string
  artStyle: ArtStyle
  /** Seed driving the user's generated avatar / art. */
  artSeed: number
  verified: boolean
  /** User ids this user follows. */
  following: string[]
}

/** A "Loop" is a repeating series: e.g. "Day 3 of 7" of a sketch challenge. */
export interface LoopInfo {
  series: string
  day: number
  total: number
}

export interface Post {
  id: string
  userId: string
  caption: string
  artSeed: number
  artStyle: ArtStyle
  createdAt: number
  likeIds: string[]
  saveIds: string[]
  loop?: LoopInfo
}

export interface Poll {
  question: string
  options: [string, string]
  votes: [number, number]
  /** userId -> option index they voted for. */
  voterIds: Record<string, number>
}

export interface Story {
  id: string
  userId: string
  artSeed: number
  artStyle: ArtStyle
  caption: string
  createdAt: number
  poll?: Poll
  viewedBy: string[]
}

export interface CommentItem {
  id: string
  postId: string
  userId: string
  text: string
  createdAt: number
}

export interface ChatMessage {
  id: string
  threadId: string
  senderId: string
  text: string
  createdAt: number
  read: boolean
}

export interface Thread {
  id: string
  participantIds: string[]
  messages: ChatMessage[]
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'loop'

export interface AppNotification {
  id: string
  actorId: string
  type: NotificationType
  text: string
  postId?: string
  createdAt: number
  read: boolean
}

export interface AppState {
  users: User[]
  posts: Post[]
  stories: Story[]
  comments: CommentItem[]
  threads: Thread[]
  notifications: AppNotification[]
  currentUserId: string
}
