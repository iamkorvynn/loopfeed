import type { AppNotification } from '../types'

const H = 3_600_000
const M = 60_000

export function seedNotifications(now: number): AppNotification[] {
  return [
    {
      id: 'n_1',
      actorId: 'u_theo',
      type: 'like',
      text: 'liked your Day 4 sketch post',
      postId: 'p_me_sketch_4',
      createdAt: now - 40 * M,
      read: false,
    },
    {
      id: 'n_2',
      actorId: 'u_mara',
      type: 'comment',
      text: 'commented: “hands ARE hard, keep going ✏️”',
      postId: 'p_me_sketch_4',
      createdAt: now - 2 * H,
      read: false,
    },
    {
      id: 'n_3',
      actorId: 'u_noor',
      type: 'follow',
      text: 'started following you',
      createdAt: now - 5 * H,
      read: true,
    },
    {
      id: 'n_4',
      actorId: 'u_ravi',
      type: 'loop',
      text: 'is on Day 3 of “7 days of one-pot dinners” — catch up before Day 4',
      postId: 'p_ravi_pot_3',
      createdAt: now - 9 * H,
      read: true,
    },
    {
      id: 'n_5',
      actorId: 'u_june',
      type: 'like',
      text: 'liked your Day 4 sketch post',
      postId: 'p_me_sketch_4',
      createdAt: now - 12 * H,
      read: true,
    },
  ]
}
