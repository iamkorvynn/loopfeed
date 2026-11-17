# LoopFeed

A clean-room Instagram-style social app — built from scratch, with its own name,
its own UI, and one twist. Runs entirely on local demo data: no backend, no
account, no real photos.

**Live demo data:** 8 people, 12 posts, 6 stories, 3 DM threads, 5 notifications —
all seeded on first load and persisted to `localStorage`. Hit **Reset demo** in
the top bar to reseed.

## The twist

1. **Story polls** — any story can ask a question with two options. Tap to vote,
   see live result bars with percentages.
2. **Loops** — a post can be part of a repeating series (e.g. “Day 12 of 30 days
   of clay”). A progress ring on the post shows where you are in the series, and
   Explore has a Loops-only filter.

## Features

- **Feed** — posts with generated art, like, double-tap / double-click to like
  (with a heart burst), save, comments, Loop progress rings, suggested people rail
- **Stories** — 24h expiry (one seeded story is already expired), tap to view
  with progress bars, auto-advance, ←/→ keyboard navigation, Esc to close
- **Comments** — view and add (Enter to post, 500-char limit)
- **Follow / unfollow** — follower/following counts update live
- **Explore** — most-liked first grid, Loops-only filter
- **Profiles** — posts grid, stats, bio, edit profile (name, bio, art style),
  Saved tab with your bookmarked posts
- **Create post** — upload an image (kept in-memory, under 2 MB) or pick a
  generated sample artwork style; optionally attach it to a Loop series
- **Search** — people (username / name / bio) and posts (caption / Loop series)
- **DMs** — 1:1 threads, send messages, unread badges, read ticks, start a new
  chat from any profile or the thread list, reply to a story (sends a DM)
- **Notifications** — likes, comments, follows and Loop updates, mark-all-read,
  All/Unread filter
- **Dark mode** — toggle in the top bar, remembered across visits
- **“/” shortcut** — jumps to search
- **Stories, posted by you** — “Post a story” in the feed, with an optional
  2-option poll; stories expire after 24h
- **Recent searches** — last 5 queries as chips, with clear
- **Followers / following lists** — tap the counts on any profile
- **Copy post link** — with Copied feedback; **delete your own comments**

## Images: no photos, all generated

Every image in LoopFeed is drawn in code. Each demo user owns one of 8 art
styles (a palette + a shape language); a numeric seed varies the composition
deterministically (`src/data/art.ts`, rendered by `src/components/ArtImage.tsx`).
No copyrighted photos, no external image URLs, no assets copied from anywhere.

## How to run

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm test           # vitest, unit + component tests
npm run build      # tsc + vite build -> dist/
npm run preview    # serve the production build
```

Requires Node 18+ (developed on Node 24). No other setup.

## How it works

- `src/store/store.ts` — the store: a tiny external store (`useSyncExternalStore`)
  over plain JSON state, persisted to `localStorage`. Every action (like, follow,
  comment, poll vote, DM send, create post, edit profile…) is a function here,
  so it is unit-testable without React.
- `src/store/selectors.ts` — derived views: feed, explore, live stories,
  search, unread counts, suggestions.
- `src/data/` — seed data builders (users, posts, stories, threads,
  notifications) + the generated-art engine.
- `src/components/` — one component per feature; `src/App.tsx` wires the views.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full map and
[`docs/DEMO.md`](docs/DEMO.md) for a 2-minute guided tour.

## Tests

199 tests across 46 files: store actions (like/unlike, follow, comment add and
delete, DM send, story expiry, poll voting, Loop creation), selectors,
generated-art determinism, seed invariants, and component tests (PostCard
double-tap like, PollCard live percentages, StoryTray expiry, SearchView,
story composer, App shell flows). Run with `npm test`; see
[`docs/TESTING.md`](docs/TESTING.md) for the conventions that keep the suite green.

## Clean-room note

LoopFeed is an original implementation. It does not copy Instagram's branding,
assets, or code, and it does not talk to Instagram at all. The demo people,
posts and captions are invented.
