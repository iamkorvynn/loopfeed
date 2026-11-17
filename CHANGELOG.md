# Changelog

## 0.2.0 — 2026-11-18

Second pass: creation, replies, and polish.

- Post your own stories, with an optional 2-option poll
- Reply to a story — sends a DM to the story owner
- Delete your own comments (post owners can delete comments on their posts too)
- Copy-post-link button with Copied feedback
- Dark mode toggle (persisted), “/” search shortcut
- Recent searches with chips + clear
- Followers / following lists (modal, Esc/backdrop to close)
- Explore sort (most liked / newest), notifications All/Unread filter
- Saved count on the profile tab, all-caught-up footer on the feed
- CI workflow (test + build on push/PR), smoke script, MIT license
- 199 vitest tests across 46 files; `npm run lint` clean

## 0.1.0 — 2026-11-18

First build: the complete LoopFeed demo.

- Feed with likes, double-tap to like, saves, comments, suggestions rail
- Stories with 24h expiry, progress bars, auto-advance, keyboard nav
- Story polls with live results (the twist, part 1)
- Loops — series posts with progress rings + Explore filter (the twist, part 2)
- Explore grid, search (people + posts), profiles with Saved tab
- Create post (upload or generated sample art, optional Loop)
- 1:1 DMs with unread badges and read ticks
- Notifications with mark-all-read
- Dark mode, “/” search shortcut, demo reset
- Generated SVG art for every image — no photos
- 67+ vitest tests (store + components), `npm run build` clean
