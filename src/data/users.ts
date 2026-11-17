import type { User } from '../types'

/** The demo cast. `me` is the signed-in demo user; everyone else is followable. */
export const CURRENT_USER_ID = 'u_me'

export function seedUsers(): User[] {
  return [
    {
      id: 'u_me',
      username: 'you.loop',
      displayName: 'You',
      bio: 'Trying one loop at a time. Day 4 of sketching daily ✏️',
      artStyle: 'dusk',
      artSeed: 11,
      verified: false,
      following: ['u_mara', 'u_theo', 'u_june', 'u_ravi'],
    },
    {
      id: 'u_mara',
      username: 'mara.makes',
      displayName: 'Mara Voss',
      bio: 'Ceramics, glaze tests & kiln days. Loop: 30 days of clay 🏺',
      artStyle: 'sunset',
      artSeed: 21,
      verified: true,
      following: ['u_me', 'u_theo', 'u_noor'],
    },
    {
      id: 'u_theo',
      username: 'theo.frames',
      displayName: 'Theo Lindqvist',
      bio: 'Generative art, one sketch a day. Loop: 100 days of code art.',
      artStyle: 'neon',
      artSeed: 32,
      verified: true,
      following: ['u_me', 'u_mara', 'u_june', 'u_ravi', 'u_noor'],
    },
    {
      id: 'u_june',
      username: 'june.wanders',
      displayName: 'June Park',
      bio: 'City walks & hidden staircases. Posting a new route every Sunday.',
      artStyle: 'ocean',
      artSeed: 43,
      verified: false,
      following: ['u_me', 'u_mara'],
    },
    {
      id: 'u_ravi',
      username: 'ravi.plates',
      displayName: 'Ravi Menon',
      bio: 'Home cook. Loop: 7 days of one-pot dinners 🍲',
      artStyle: 'candy',
      artSeed: 54,
      verified: false,
      following: ['u_me', 'u_theo'],
    },
    {
      id: 'u_noor',
      username: 'noor.lines',
      displayName: 'Noor Haddad',
      bio: 'Type & poster design. Loop: a poster every Friday.',
      artStyle: 'mono',
      artSeed: 65,
      verified: true,
      following: ['u_mara', 'u_theo'],
    },
    {
      id: 'u_finn',
      username: 'finn.trails',
      displayName: 'Finn Okafor',
      bio: 'Trail runs & sunrise starts. Loop: 14 mornings, 5am club.',
      artStyle: 'forest',
      artSeed: 76,
      verified: false,
      following: ['u_june', 'u_ravi'],
    },
    {
      id: 'u_sana',
      username: 'sana.sketches',
      displayName: 'Sana Iqbal',
      bio: 'Ink, paper, patience. Loop: 7 days of botanical ink.',
      artStyle: 'geo',
      artSeed: 87,
      verified: false,
      following: ['u_me', 'u_noor', 'u_sana'],
    },
  ]
}
