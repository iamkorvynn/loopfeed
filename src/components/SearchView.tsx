import { useState } from 'react'
import type { AppState } from '../types'
import { searchAll } from '../store/selectors'
import { UserRow } from './UserRow'
import { ArtImage } from './ArtImage'
import { uploadedImages } from '../store/store'

interface SearchViewProps {
  state: AppState
  onOpenProfile: (userId: string) => void
  onOpenPost: (postId: string) => void
}

/** Search people (username / name / bio) and posts (caption / Loop series). */
export function SearchView({ state, onOpenProfile, onOpenPost }: SearchViewProps) {
  const [query, setQuery] = useState('')
  const { users, posts } = searchAll(state, query)
  const me = state.users.find((u) => u.id === state.currentUserId)

  return (
    <div className="search-view">
      <h1>Search</h1>
      <input
        type="search"
        className="search-input"
        value={query}
        placeholder="Search people, captions, Loops…"
        aria-label="Search LoopFeed"
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim() === '' && (
        <p className="search-hint">Try “clay”, “neon”, “mara”, or a Loop series like “one-pot”.</p>
      )}
      {query.trim() !== '' && users.length === 0 && posts.length === 0 && (
        <p className="search-hint">No results for “{query}”. Try another word.</p>
      )}
      {users.length > 0 && (
        <section aria-label="People">
          <h2 className="search-section">People</h2>
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              following={me?.following.includes(u.id) ?? false}
              isSelf={u.id === me?.id}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </section>
      )}
      {posts.length > 0 && (
        <section aria-label="Posts">
          <h2 className="search-section">Posts</h2>
          <div className="explore-grid">
            {posts.map((p) => (
              <button
                key={p.id}
                type="button"
                className="explore-tile"
                onClick={() => onOpenPost(p.id)}
                aria-label={`Post: ${p.caption}`}
              >
                <ArtImage
                  artStyle={p.artStyle}
                  artSeed={p.artSeed}
                  label={p.caption}
                  className="explore-art"
                  imageDataUrl={uploadedImages.get(p.id)}
                />
                {p.loop && <span className="explore-loop-badge">⟳ {p.loop.day}/{p.loop.total}</span>}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
