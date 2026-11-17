import { useState } from 'react'
import type { AppState } from '../types'
import { explorePosts } from '../store/selectors'
import { ArtImage } from './ArtImage'
import { uploadedImages } from '../store/store'
import { EmptyState } from './EmptyState'

interface ExploreGridProps {
  state: AppState
  onOpenPost: (postId: string) => void
}

/** Explore: most-liked first, with a Loops-only filter. */
export function ExploreGrid({ state, onOpenPost }: ExploreGridProps) {
  const [loopsOnly, setLoopsOnly] = useState(false)
  const all = explorePosts(state)
  const posts = loopsOnly ? all.filter((p) => p.loop) : all

  return (
    <div className="explore">
      <div className="explore-head">
        <h1>Explore</h1>
        <label className="explore-filter">
          <input
            type="checkbox"
            checked={loopsOnly}
            onChange={(e) => setLoopsOnly(e.target.checked)}
          />
          Loops only
        </label>
      </div>
      {posts.length === 0 ? (
        <EmptyState title="No Loops yet" body="No posts in a series right now — try turning the filter off." />
      ) : (
        <div className="explore-grid" role="list" aria-label="Explore posts">
          {posts.map((p) => (
            <button
              key={p.id}
              type="button"
              role="listitem"
              className="explore-tile"
              onClick={() => onOpenPost(p.id)}
              aria-label={`Explore post by ${state.users.find((u) => u.id === p.userId)?.username ?? 'unknown'}${p.loop ? `, Loop ${p.loop.series} day ${p.loop.day} of ${p.loop.total}` : ''}`}
            >
              <ArtImage
                artStyle={p.artStyle}
                artSeed={p.artSeed}
                label={p.caption}
                className="explore-art"
                imageDataUrl={uploadedImages.get(p.id)}
              />
              {p.loop && (
                <span className="explore-loop-badge">
                  ⟳ {p.loop.day}/{p.loop.total}
                </span>
              )}
              <span className="explore-likes">❤️ {p.likeIds.length}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
