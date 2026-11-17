import type { Thread } from '../types'

const H = 3_600_000
const M = 60_000

/** Three seeded 1:1 DM threads, one with an unread message for you. */
export function seedThreads(now: number): Thread[] {
  return [
    {
      id: 't_mara',
      participantIds: ['u_me', 'u_mara'],
      messages: [
        {
          id: 'm_mara_1',
          threadId: 't_mara',
          senderId: 'u_mara',
          text: 'kiln opens at 6 — want first look at the day 12 pieces?',
          createdAt: now - 3 * H,
          read: true,
        },
        {
          id: 'm_mara_2',
          threadId: 't_mara',
          senderId: 'u_me',
          text: 'yes! bring the pink tile too, I need to see if it really fires brown 😄',
          createdAt: now - 2 * H - 50 * M,
          read: true,
        },
        {
          id: 'm_mara_3',
          threadId: 't_mara',
          senderId: 'u_mara',
          text: 'it fires brown. it always fires brown. see you at 6',
          createdAt: now - 2 * H,
          read: false,
        },
      ],
    },
    {
      id: 't_theo',
      participantIds: ['u_me', 'u_theo'],
      messages: [
        {
          id: 'm_theo_1',
          threadId: 't_theo',
          senderId: 'u_theo',
          text: 'vote in my story poll? torn between neon and mono for day 42',
          createdAt: now - 1 * H,
          read: true,
        },
        {
          id: 'm_theo_2',
          threadId: 't_theo',
          senderId: 'u_me',
          text: 'neon, obviously. the grid deserves the glow',
          createdAt: now - 55 * M,
          read: true,
        },
      ],
    },
    {
      id: 't_june',
      participantIds: ['u_me', 'u_june'],
      messages: [
        {
          id: 'm_june_1',
          threadId: 't_june',
          senderId: 'u_june',
          text: 'route #7 has a staircase AND a rooftop, you in for sunday?',
          createdAt: now - 7 * H,
          read: true,
        },
        {
          id: 'm_june_2',
          threadId: 't_june',
          senderId: 'u_me',
          text: 'in. bring the map, I’m bringing snacks',
          createdAt: now - 6 * H,
          read: true,
        },
      ],
    },
  ]
}
