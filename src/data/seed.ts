import type { AppState } from '../types'
import { CURRENT_USER_ID, seedUsers } from './users'
import { seedPosts } from './posts'
import { seedStories } from './stories'
import { seedThreads } from './threads'
import { seedNotifications } from './notifications'

export { CURRENT_USER_ID }

/** Build the full demo state. `now` is injectable so tests can freeze time. */
export function buildSeedState(now: number = Date.now()): AppState {
  return {
    users: seedUsers(),
    posts: seedPosts(now),
    stories: seedStories(now),
    comments: [
      {
        id: 'c_1',
        postId: 'p_me_sketch_4',
        userId: 'u_mara',
        text: 'hands ARE hard, keep going ✏️',
        createdAt: now - 2 * 3_600_000,
      },
      {
        id: 'c_2',
        postId: 'p_me_sketch_4',
        userId: 'u_theo',
        text: 'day 4 already looking cleaner than my day 40, respect',
        createdAt: now - 90 * 60_000,
      },
      {
        id: 'c_3',
        postId: 'p_theo_gen_41',
        userId: 'u_me',
        text: 'this one belongs on a wall, not a feed',
        createdAt: now - 4 * 3_600_000,
      },
      {
        id: 'c_4',
        postId: 'p_ravi_pot_3',
        userId: 'u_june',
        text: 'making this tonight, no notes',
        createdAt: now - 10 * 3_600_000,
      },
    ],
    threads: seedThreads(now),
    notifications: seedNotifications(now),
    currentUserId: CURRENT_USER_ID,
  }
}
