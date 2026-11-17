# Testing LoopFeed

## Run

```bash
npm test           # full suite, once
npm run test:watch # watch mode while hacking
```

## What is covered

199 tests across 46 files (vitest + jsdom + React Testing Library):

| Area | Files | What's asserted |
| --- | --- | --- |
| Store actions | `src/store/*.test.ts` | like/unlike, save, follow (incl. no self-follow), comment add/delete + permissions, DM send/thread-create/read/sort, story expiry, poll voting + re-vote moves, Loop creation, addStory, editProfile, mark-all-read, reset |
| Selectors | `src/store/selectors.test.ts` | feed scope + order, explore order, live stories, saved posts, search, followers/following, unread counts, suggestions, comments order |
| Persistence | `src/store/persistence.test.ts` | round-trip, empty storage seeds, corrupt JSON reseeds, wrong-shape reseeds, clear |
| Generated art | `src/data/art.test.ts`, `src/utils/ids.test.ts` | 8 palettes, deterministic compositions, PRNG determinism |
| Seed | `src/data/seed.test.ts` | every referenced id exists, 1:1 threads, no self-follows, unique usernames, polls have 2 options |
| Utils | `src/utils/*.test.ts` | timeAgo, compactCount, loopProgress, recent searches, theme |
| Components | `src/components/*.test.tsx`, `src/App*.test.tsx` | PostCard (render, like, double-tap, copy link, save, Loop ring), PollCard (vote, percentages, aria-pressed), StoryTray/Viewer (expiry, keys, reply DM), FeedView, ExploreGrid (filter + sort), SearchView (+ recents), CreatePost (validation, upload), ProfileView (stats, Saved, FollowList), MessagesView (threads, badges, Enter send, new chat), NotificationsView (filter, mark-all-read), EditProfile, NavBar (badges, dark mode), App shell (nav, `/` shortcut, reset demo, create flow) |

## Conventions that keep the suite green

1. **Live clock.** Tests use `Date.now()` as the seed base (`resetState(Date.now())`
   in `beforeEach`). Seeded timestamps are relative to load time and actions
   stamp `Date.now()`, so a frozen future date breaks ordering tests (newest
   first, thread bumping, story expiry).
2. **Re-render after store actions.** Components that take `state` as a prop
   don't re-render on their own — tests re-render with `getState()`, exactly
   what the App shell does via `useStore`.
3. **Seed facts to remember.** `p_june_stairs` is already liked by me;
   `p_finn_sunrise` is not. Mara is already followed. Theo and June both liked
   the Day 4 sketch post, so that notification text appears twice. The expired
   story is `s_noor_expired` (26h old).
4. **jsdom gaps.** jsdom has no `scrollIntoView` — `MessagesView` guards it.
   `FileReader` works; `navigator.clipboard` is stubbed per test.
