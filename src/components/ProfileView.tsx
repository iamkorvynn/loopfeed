import { useState } from 'react'
import type { AppState } from '../types'
import { followersOf, followingOf, postsByUser, savedPosts } from '../store/selectors'
import { uploadedImages } from '../store/store'
import { Avatar } from './Avatar'
import { ArtImage } from './ArtImage'
import { FollowButton } from './FollowButton'
import { FollowList } from './FollowList'
import { EditProfile } from './EditProfile'
import { EmptyState } from './EmptyState'

interface ProfileViewProps {
  userId: string
  state: AppState
  onOpenPost: (postId: string) => void
  onMessage: (userId: string) => void
  onOpenProfile: (userId: string) => void
}

export function ProfileView({ userId, state, onOpenPost, onMessage, onOpenProfile }: ProfileViewProps) {
  const [tab, setTab] = useState<'posts' | 'saved'>('posts')
  const [editing, setEditing] = useState(false)
  const [list, setList] = useState<'followers' | 'following' | null>(null)
  const user = state.users.find((u) => u.id === userId)
  const me = state.users.find((u) => u.id === state.currentUserId)
  if (!user || !me) return null

  const isSelf = user.id === me.id
  const followers = followersOf(state, user.id)
  const following = followingOf(state, user.id)
  const posts = postsByUser(state, user.id)
  const saved = savedPosts(state, user.id)
  const shown = tab === 'posts' ? posts : saved

  if (editing && isSelf) {
    return <EditProfile state={state} onDone={() => setEditing(false)} />
  }

  return (
    <div className="profile">
      <header className="profile-head">
        <Avatar username={user.username} artStyle={user.artStyle} artSeed={user.artSeed} size={88} ring />
        <div className="profile-info">
          <div className="profile-name-row">
            <h1>{user.username}{user.verified && <span aria-label="Verified account"> ✓</span>}</h1>
            {isSelf ? (
              <button type="button" className="btn btn--ghost" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            ) : (
              <>
                <FollowButton targetUserId={user.id} following={me.following.includes(user.id)} />
                <button type="button" className="btn btn--ghost" onClick={() => onMessage(user.id)}>
                  Message
                </button>
              </>
            )}
          </div>
          <p className="profile-display">{user.displayName}</p>
          <p className="profile-bio">{user.bio}</p>
          <p className="profile-stats">
            <span><strong>{posts.length}</strong> posts</span>
            <button type="button" className="stat-btn" onClick={() => setList('followers')}>
              <strong>{followers.length}</strong> followers
            </button>
            <button type="button" className="stat-btn" onClick={() => setList('following')}>
              <strong>{following.length}</strong> following
            </button>
          </p>
        </div>
      </header>

      {list && (
        <FollowList
          title={list === 'followers' ? `${user.displayName}'s followers` : `${user.displayName} is following`}
          users={list === 'followers' ? followers : following}
          state={state}
          onClose={() => setList(null)}
          onOpenProfile={onOpenProfile}
        />
      )}

      <div className="profile-tabs" role="tablist" aria-label="Profile tabs">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'posts'}
          className={tab === 'posts' ? 'profile-tab profile-tab--active' : 'profile-tab'}
          onClick={() => setTab('posts')}
        >
          ▦ Posts
        </button>
        {isSelf && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'saved'}
            className={tab === 'saved' ? 'profile-tab profile-tab--active' : 'profile-tab'}
            onClick={() => setTab('saved')}
          >
            🔖 Saved ({saved.length})
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={tab === 'posts' ? 'No posts yet' : 'Nothing saved yet'}
          body={tab === 'posts' ? `${user.displayName} hasn't posted anything yet.` : 'Tap the bookmark on any post to save it here.'}
        />
      ) : (
        <div className="explore-grid">
          {shown.map((p) => (
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
      )}
    </div>
  )
}
