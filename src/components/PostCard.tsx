import { useRef, useState } from 'react'
import type { AppState, Post } from '../types'
import { toggleLike, uploadedImages } from '../store/store'
import { Avatar } from './Avatar'
import { ArtImage } from './ArtImage'
import { LoopRing } from './LoopRing'
import { LikeButton } from './LikeButton'
import { SaveButton } from './SaveButton'
import { CommentsSection } from './CommentsSection'
import { timeAgo } from '../utils/format'

interface PostCardProps {
  post: Post
  state: AppState
  onOpenProfile: (userId: string) => void
}

/**
 * A feed post: header, generated art (double-tap / double-click to like),
 * like + save actions, caption, Loop progress ring, comments.
 */
export function PostCard({ post, state, onOpenProfile }: PostCardProps) {
  const author = state.users.find((u) => u.id === post.userId)
  const me = state.currentUserId
  const [showBurst, setShowBurst] = useState(false)
  const lastTap = useRef(0)
  if (!author) return null

  const liked = post.likeIds.includes(me)
  const saved = post.saveIds.includes(me)

  const doubleTap = () => {
    const now = Date.now()
    if (now - lastTap.current < 350) {
      if (!post.likeIds.includes(me)) toggleLike(post.id)
      setShowBurst(true)
      window.setTimeout(() => setShowBurst(false), 800)
    }
    lastTap.current = now
  }

  return (
    <article className="post-card" aria-label={`Post by ${author.username}`}>
      <header className="post-header">
        <button type="button" className="post-author" onClick={() => onOpenProfile(author.id)}>
          <Avatar username={author.username} artStyle={author.artStyle} artSeed={author.artSeed} size={36} />
          <span className="post-author-text">
            <span className="post-author-name">
              {author.username}
              {author.verified && <span aria-label="Verified account"> ✓</span>}
            </span>
            <span className="post-time">{timeAgo(post.createdAt)}</span>
          </span>
        </button>
        {post.loop && (
          <span className="post-loop">
            <LoopRing day={post.loop.day} total={post.loop.total} series={post.loop.series} />
            <span className="post-loop-label">Loop · {post.loop.series}</span>
          </span>
        )}
      </header>

      <div className="post-media" onClick={doubleTap} role="button" tabIndex={0}
        aria-label="Post image, double-click to like"
        onKeyDown={(e) => {
          if (e.key === 'Enter') doubleTap()
        }}
      >
        <ArtImage
          artStyle={post.artStyle}
          artSeed={post.artSeed}
          label={`Artwork for ${author.username}'s post: ${post.caption}`}
          className="post-art"
          imageDataUrl={uploadedImages.get(post.id)}
        />
        {showBurst && <span className="like-burst" aria-hidden="true">❤️</span>}
      </div>

      <div className="post-actions">
        <LikeButton postId={post.id} liked={liked} count={post.likeIds.length} />
        <span className="post-action-spacer" />
        <SaveButton postId={post.id} saved={saved} />
      </div>

      <p className="post-caption">
        <button type="button" className="link-btn" onClick={() => onOpenProfile(author.id)}>
          <strong>{author.username}</strong>
        </button>{' '}
        {post.caption}
      </p>

      <CommentsSection postId={post.id} state={state} />
    </article>
  )
}
