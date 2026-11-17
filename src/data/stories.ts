import type { Story } from '../types'

const H = 3_600_000

/**
 * Seeded stories. Stories expire 24h after creation — one seeded story is
 * already expired (created 26h ago) so expiry is visible in the app and
 * covered by tests. Two stories carry polls (the LoopFeed twist).
 */
export function seedStories(now: number): Story[] {
  return [
    {
      id: 's_theo_poll',
      userId: 'u_theo',
      artSeed: 201,
      artStyle: 'neon',
      caption: 'Which palette wins?',
      createdAt: now - 1 * H,
      poll: {
        question: 'Which palette should I ship for day 42?',
        options: ['Neon grid', 'Mono grid'],
        votes: [14, 9],
        voterIds: { u_mara: 0, u_june: 1 },
      },
      viewedBy: ['u_me'],
    },
    {
      id: 's_mara_kiln',
      userId: 'u_mara',
      artSeed: 202,
      artStyle: 'sunset',
      caption: 'Kiln opens at 6pm 🔥',
      createdAt: now - 3 * H,
      viewedBy: [],
    },
    {
      id: 's_ravi_poll',
      userId: 'u_ravi',
      artSeed: 203,
      artStyle: 'candy',
      caption: 'Tomorrow’s pot — you pick',
      createdAt: now - 4 * H,
      poll: {
        question: 'What goes in tomorrow’s one-pot dinner?',
        options: ['Mushroom risotto', 'Chickpea stew'],
        votes: [21, 17],
        voterIds: { u_theo: 1 },
      },
      viewedBy: [],
    },
    {
      id: 's_june_route',
      userId: 'u_june',
      artSeed: 204,
      artStyle: 'ocean',
      caption: 'Route #7 preview',
      createdAt: now - 6 * H,
      viewedBy: ['u_me'],
    },
    {
      id: 's_finn_run',
      userId: 'u_finn',
      artSeed: 205,
      artStyle: 'forest',
      caption: '5am. Again. Worth it.',
      createdAt: now - 9 * H,
      viewedBy: [],
    },
    {
      id: 's_noor_expired',
      userId: 'u_noor',
      artSeed: 206,
      artStyle: 'mono',
      caption: 'Yesterday’s poster draft (expired)',
      createdAt: now - 26 * H,
      viewedBy: [],
    },
  ]
}
