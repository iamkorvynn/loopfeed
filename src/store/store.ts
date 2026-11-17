/**
 * The LoopFeed store: a tiny external store (useSyncExternalStore) over an
 * immutable-ish AppState, persisted to localStorage. Every user action is a
 * pure-ish transition function here so it can be unit-tested without React.
 */
import type {
  AppState,
  ArtStyle,
  ChatMessage,
  CommentItem,
  LoopInfo,
  Post,
  Story,
  User,
} from '../types'
import { newId } from '../utils/ids'
import { buildSeedState } from '../data/seed'
import { clearPersistedState, loadState, persistState } from './persistence'

export const STORY_TTL_MS = 24 * 3_600_000

type Listener = () => void

let state: AppState = loadState()
const listeners = new Set<Listener>()

export function getState(): AppState {
  return state
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function commit(next: AppState): void {
  state = next
  persistState(state)
  listeners.forEach((l) => l())
}

/** Deep-ish clone via JSON: state is plain data only. */
function clone(s: AppState): AppState {
  return JSON.parse(JSON.stringify(s)) as AppState
}

/** Test helper: replace the whole state with a fresh seed. */
export function resetState(now: number = Date.now()): AppState {
  const next = buildSeedState(now)
  commit(next)
  return next
}

/** Test helper: swap state without touching localStorage listeners twice. */
export function setStateForTests(next: AppState): void {
  commit(next)
}

export function userById(s: AppState, id: string): User | undefined {
  return s.users.find((u) => u.id === id)
}

export function currentUser(s: AppState): User {
  const u = userById(s, s.currentUserId)
  if (!u) throw new Error('current user missing from state')
  return u
}

/** True when a story is older than 24h. */
export function isStoryExpired(story: Story, now: number = Date.now()): boolean {
  return now - story.createdAt > STORY_TTL_MS
}

/** Toggle like on a post. Returns true if the post is now liked. */
export function toggleLike(postId: string, userId?: string): boolean {
  const next = clone(state)
  const me = userId ?? next.currentUserId
  const post = next.posts.find((p) => p.id === postId)
  if (!post) return false
  const idx = post.likeIds.indexOf(me)
  if (idx >= 0) post.likeIds.splice(idx, 1)
  else post.likeIds.push(me)
  commit(next)
  return post.likeIds.includes(me)
}

/** Toggle save on a post. Returns true if the post is now saved. */
export function toggleSave(postId: string, userId?: string): boolean {
  const next = clone(state)
  const me = userId ?? next.currentUserId
  const post = next.posts.find((p) => p.id === postId)
  if (!post) return false
  const idx = post.saveIds.indexOf(me)
  if (idx >= 0) post.saveIds.splice(idx, 1)
  else post.saveIds.push(me)
  commit(next)
  return post.saveIds.includes(me)
}

/**
 * Follow / unfollow another user. Following yourself is a no-op.
 * Returns true if now following.
 */
export function toggleFollow(targetUserId: string): boolean {
  const next = clone(state)
  const me = currentUser(next)
  if (targetUserId === me.id) return false
  const idx = me.following.indexOf(targetUserId)
  if (idx >= 0) me.following.splice(idx, 1)
  else me.following.push(targetUserId)
  commit(next)
  return me.following.includes(targetUserId)
}

/** Add a comment. Empty / whitespace-only text is rejected (returns null). */
export function addComment(postId: string, text: string, userId?: string): CommentItem | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  if (!state.posts.some((p) => p.id === postId)) return null
  const next = clone(state)
  const comment: CommentItem = {
    id: newId('c'),
    postId,
    userId: userId ?? next.currentUserId,
    text: trimmed.slice(0, 500),
    createdAt: Date.now(),
  }
  next.comments.push(comment)
  commit(next)
  return comment
}

/** Vote in a story poll. One vote per user; re-voting moves the vote. */
export function votePoll(storyId: string, option: 0 | 1, userId?: string): boolean {
  const next = clone(state)
  const me = userId ?? next.currentUserId
  const story = next.stories.find((s) => s.id === storyId)
  if (!story || !story.poll) return false
  const prev = story.poll.voterIds[me]
  if (prev === option) return true // already voted this way
  if (prev !== undefined) story.poll.votes[prev] -= 1
  story.poll.votes[option] += 1
  story.poll.voterIds[me] = option
  commit(next)
  return true
}

/** Mark a story viewed by the current user. */
export function markStoryViewed(storyId: string, userId?: string): void {
  const next = clone(state)
  const me = userId ?? next.currentUserId
  const story = next.stories.find((s) => s.id === storyId)
  if (!story || story.viewedBy.includes(me)) return
  story.viewedBy.push(me)
  commit(next)
}

/**
 * Send a DM. Creates the thread if none exists for the pair.
 * Empty text is rejected (returns null).
 */
export function sendMessage(
  otherUserId: string,
  text: string,
  threadId?: string,
): ChatMessage | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  const next = clone(state)
  const me = next.currentUserId
  let thread = threadId
    ? next.threads.find((t) => t.id === threadId)
    : next.threads.find(
        (t) =>
          t.participantIds.includes(me) &&
          t.participantIds.includes(otherUserId) &&
          t.participantIds.length === 2,
      )
  if (!thread) {
    thread = { id: newId('t'), participantIds: [me, otherUserId], messages: [] }
    next.threads.push(thread)
  }
  const message: ChatMessage = {
    id: newId('m'),
    threadId: thread.id,
    senderId: me,
    text: trimmed.slice(0, 1000),
    createdAt: Date.now(),
    read: false,
  }
  thread.messages.push(message)
  commit(next)
  return message
}

/** Mark every message from the other person in a thread as read. */
export function markThreadRead(threadId: string): void {
  const next = clone(state)
  const thread = next.threads.find((t) => t.id === threadId)
  if (!thread) return
  let changed = false
  for (const m of thread.messages) {
    if (m.senderId !== next.currentUserId && !m.read) {
      m.read = true
      changed = true
    }
  }
  if (changed) commit(next)
}

/** Mark all notifications read. */
export function markAllNotificationsRead(): void {
  const next = clone(state)
  let changed = false
  for (const n of next.notifications) {
    if (!n.read) {
      n.read = true
      changed = true
    }
  }
  if (changed) commit(next)
}

/** Create a post from an uploaded image (data URL) or a generated sample. */
export function createPost(input: {
  caption: string
  artSeed: number
  artStyle: ArtStyle
  loop?: LoopInfo
  imageDataUrl?: string
}): Post {
  const next = clone(state)
  const post: Post = {
    id: newId('p'),
    userId: next.currentUserId,
    caption: input.caption.trim().slice(0, 500),
    artSeed: input.artSeed,
    artStyle: input.artStyle,
    createdAt: Date.now(),
    likeIds: [],
    saveIds: [],
    loop: input.loop,
  }
  // Uploaded images are stored as the art seed's data URL via a side channel:
  // keep the post itself serializable; the data URL lives in the image map.
  if (input.imageDataUrl) uploadedImages.set(post.id, input.imageDataUrl)
  next.posts.unshift(post)
  commit(next)
  return post
}

/** In-memory map of uploaded post images (data URLs are too big for the store). */
export const uploadedImages = new Map<string, string>()

/** Edit the current user's profile. Empty display name is rejected. */
export function editProfile(input: {
  displayName: string
  bio: string
  artStyle: ArtStyle
}): boolean {
  const name = input.displayName.trim()
  if (!name) return false
  const next = clone(state)
  const me = currentUser(next)
  me.displayName = name.slice(0, 60)
  me.bio = input.bio.trim().slice(0, 200)
  me.artStyle = input.artStyle
  commit(next)
  return true
}

/** Wipe local state and reseed the demo. */
export function resetDemo(): AppState {
  clearPersistedState()
  return resetState()
}

/** Delete a comment. Only the comment's author (or the post owner) may delete. */
export function deleteComment(commentId: string, userId?: string): boolean {
  const next = clone(state)
  const me = userId ?? next.currentUserId
  const idx = next.comments.findIndex((c) => c.id === commentId)
  if (idx < 0) return false
  const comment = next.comments[idx]
  const post = next.posts.find((p) => p.id === comment.postId)
  if (comment.userId !== me && post?.userId !== me) return false
  next.comments.splice(idx, 1)
  commit(next)
  return true
}

/** Post a new story (24h expiry). Optionally attach a 2-option poll. */
export function addStory(input: {
  caption: string
  artSeed: number
  artStyle: ArtStyle
  poll?: { question: string; options: [string, string] }
}): Story {
  const next = clone(state)
  const story: Story = {
    id: newId('s'),
    userId: next.currentUserId,
    caption: input.caption.trim().slice(0, 200),
    artSeed: input.artSeed,
    artStyle: input.artStyle,
    createdAt: Date.now(),
    poll: input.poll
      ? {
          question: input.poll.question.trim().slice(0, 140),
          options: input.poll.options,
          votes: [0, 0],
          voterIds: {},
        }
      : undefined,
    viewedBy: [],
  }
  next.stories.unshift(story)
  commit(next)
  return story
}
