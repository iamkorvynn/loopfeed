# Architecture

## Stack

- **Vite 8 + React 19 + TypeScript** (strict, `verbatimModuleSyntax`)
- **Vitest + jsdom + React Testing Library** for tests
- **No UI framework, no router, no backend.** State lives in one plain object
  (`AppState`) persisted to `localStorage` under `loopfeed-state-v1`.

## Data flow

```
seed (src/data/*) ──> loadState() ──> module store (src/store/store.ts)
                                        │  useSyncExternalStore
                                        ▼
                              App (useStore) ──> views ──> components
                                        ▲
                              actions (toggleLike, sendMessage, …)
                              commit() → persist + notify listeners
```

- The store module holds the single source of truth and a listener set.
  `commit()` clones, persists, then notifies — React re-renders through
  `useStore()`.
- Actions are plain functions over `AppState`, so unit tests call them directly
  without rendering anything. Components receive `state` as a prop (or read it
  via `useStore` in the App shell).
- Selectors (`src/store/selectors.ts`) are pure derivations: feed, explore,
  live stories, search, unread counts, suggestions.

## Files

| Area | Files | Notes |
| --- | --- | --- |
| Types | `src/types.ts` | User, Post, LoopInfo, Poll, Story, Comment, Thread, Notification, AppState |
| Seed data | `src/data/users.ts`, `posts.ts`, `stories.ts`, `threads.ts`, `notifications.ts`, `seed.ts` | Builders take `now` so tests can freeze time |
| Generated art | `src/data/art.ts`, `src/components/ArtImage.tsx`, `src/components/Avatar.tsx` | 8 palettes, seeded PRNG compositions, inline SVG |
| Store | `src/store/store.ts`, `persistence.ts`, `selectors.ts`, `useStore.ts` | Actions, localStorage, derived views, hook |
| Feed | `FeedView`, `PostCard`, `LikeButton`, `SaveButton`, `CommentsSection`, `CommentItem` | Double-tap like, heart burst, Loop ring |
| Stories | `StoryTray`, `StoryViewer`, `PollCard` | 24h expiry, progress, auto-advance, polls |
| Discovery | `ExploreGrid`, `SearchView`, `UserRow`, `FollowButton` | Loops-only filter, people+post search |
| Profile | `ProfileView`, `EditProfile` | Posts/Saved tabs, stats |
| Messages | `MessagesView`, `ThreadList`, `MessageBubble` | Two-pane DM, read ticks |
| Notifications | `NotificationsView`, `NotificationItem` | Mark-all-read |
| Shell | `src/App.tsx`, `NavBar`, `EmptyState` | View routing, badges, dark mode, reset demo |

## Key rules in the store

- **Stories expire after 24h** (`STORY_TTL_MS`). `liveStories()` filters them out;
  the seeded expired story proves the rule.
- **One poll vote per user.** Re-voting moves the vote (decrement old, increment
  new); voting the same option again is a no-op.
- **No self-follow.** `toggleFollow` on your own id is a no-op.
- **Empty input is rejected.** Empty comments and DMs return `null`; an empty
  display name fails `editProfile`.
- **Uploaded images stay out of the store.** `createPost` keeps a data URL in
  the in-memory `uploadedImages` map so `localStorage` never holds megabytes.

## Testing

- Store tests reset state with `resetState(Date.now())` in `beforeEach` and
  assert transitions + localStorage persistence.
- Component tests render with `buildSeedState(Date.now())`. Note: PostCard
  takes `state` as a prop, so tests re-render with `getState()` after an
  action — mirroring what the App shell does via `useStore`.
- The test clock is live `Date.now()`, not a fixed date: seeded timestamps are
  relative to load time, and actions stamp `Date.now()`, so ordering tests
  (newest first, thread bumping) only hold on a live clock.
