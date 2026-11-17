# Contributing to LoopFeed

LoopFeed is a demo app, but contributions that keep it clean and honest are welcome.

## Ground rules

- **Clean-room only.** No Instagram branding, assets, or code. No real photos:
  every image is generated SVG art (`src/data/art.ts`).
- **No backend, no secrets.** Everything runs on local demo data in
  `localStorage`. Never commit credentials, tokens, or API keys.
- **Small, real commits.** One file or one feature per commit, with a message
  that says what changed and why.

## Workflow

```bash
npm install
npm run dev      # hack on http://localhost:5173
npm test         # vitest — add a test with every feature or fix
npm run build    # must pass clean (tsc + vite build)
```

## Where things live

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the map. The short version:

- `src/store/store.ts` — all state transitions (testable without React)
- `src/store/selectors.ts` — derived views (feed, explore, search, unread)
- `src/data/` — seed data + generated-art engine
- `src/components/` — one component per feature

## Tests

- Store tests reset with `resetState(Date.now())` in `beforeEach` and use a
  **live clock** — seeded timestamps are relative to load time, so a frozen
  future date breaks ordering tests.
- Components that take `state` as a prop need a re-render with `getState()`
  after a store action (that's what the App shell does via `useStore`).
