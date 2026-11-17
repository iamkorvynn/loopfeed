import { useState } from 'react'
import { useStore } from './store/useStore'
import { resetDemo } from './store/store'
import { unreadDmCount, unreadNotificationCount } from './store/selectors'
import { NavBar, type View } from './components/NavBar'
import { FeedView } from './components/FeedView'
import { ExploreGrid } from './components/ExploreGrid'
import { SearchView } from './components/SearchView'
import { CreatePost } from './components/CreatePost'
import { ProfileView } from './components/ProfileView'
import { MessagesView } from './components/MessagesView'
import { NotificationsView } from './components/NotificationsView'
import { StoryViewer } from './components/StoryViewer'
import { PostCard } from './components/PostCard'
import { EmptyState } from './components/EmptyState'

/**
 * LoopFeed shell: top nav + one view at a time. Post detail is a single
 * PostCard with comments open; profiles, stories and DMs overlay the view.
 */
export default function App() {
  const state = useStore()
  const [view, setView] = useState<View>('feed')
  const [profileUserId, setProfileUserId] = useState<string | null>(null)
  const [storyUserId, setStoryUserId] = useState<string | null>(null)
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(undefined)
  const [startWithUserId, setStartWithUserId] = useState<string | undefined>(undefined)
  const [detailPostId, setDetailPostId] = useState<string | null>(null)

  const navigate = (next: View) => {
    setView(next)
    setProfileUserId(next === 'profile' ? state.currentUserId : null)
    setDetailPostId(null)
    setStoryUserId(null)
  }

  const openProfile = (userId: string) => {
    setProfileUserId(userId)
    setDetailPostId(null)
    setView('profile')
  }

  const openPost = (postId: string) => setDetailPostId(postId)

  const openMessagesWith = (userId: string) => {
    setView('messages')
    setDetailPostId(null)
    setStartWithUserId(userId)
  }

  const onResetDemo = () => {
    if (window.confirm('Reset LoopFeed demo data back to the original seed? Your likes, posts and messages will be replaced.')) {
      resetDemo()
      navigate('feed')
    }
  }

  const detailPost = detailPostId
    ? state.posts.find((p) => p.id === detailPostId)
    : undefined

  return (
    <div className="app">
      <NavBar
        view={view}
        onNavigate={navigate}
        unreadDms={unreadDmCount(state)}
        unreadNotifs={unreadNotificationCount(state)}
        onResetDemo={onResetDemo}
      />
      <div className="app-body">
        {detailPost ? (
          <div className="post-detail">
            <button type="button" className="btn btn--ghost" onClick={() => setDetailPostId(null)}>
              ← Back
            </button>
            <PostCard post={detailPost} state={state} onOpenProfile={openProfile} />
          </div>
        ) : view === 'feed' ? (
          <FeedView
            state={state}
            onOpenProfile={openProfile}
            onOpenStory={setStoryUserId}
            onGoExplore={() => navigate('explore')}
          />
        ) : view === 'explore' ? (
          <ExploreGrid state={state} onOpenPost={openPost} />
        ) : view === 'search' ? (
          <SearchView state={state} onOpenProfile={openProfile} onOpenPost={openPost} />
        ) : view === 'create' ? (
          <CreatePost
            onCreated={(postId) => {
              setDetailPostId(postId)
              setView('feed')
            }}
          />
        ) : view === 'messages' ? (
          <MessagesView
            state={state}
            activeThreadId={activeThreadId}
            onSelectThread={setActiveThreadId}
            onOpenProfile={openProfile}
            startWithUserId={startWithUserId}
            onStarted={() => setStartWithUserId(undefined)}
          />
        ) : view === 'notifications' ? (
          <NotificationsView state={state} onOpenPost={openPost} />
        ) : view === 'profile' ? (
          profileUserId ? (
            <ProfileView
              userId={profileUserId}
              state={state}
              onOpenPost={openPost}
              onMessage={openMessagesWith}
            />
          ) : (
            <EmptyState title="No profile selected" body="Pick a person from the feed or search." />
          )
        ) : null}
      </div>
      <footer className="app-footer">
        <p>
          LoopFeed — a clean-room demo. All artwork is generated in code; all data lives in
          your browser (localStorage). No account, no backend, no real photos.
        </p>
      </footer>
      {storyUserId && (
        <StoryViewer
          userId={storyUserId}
          state={state}
          onClose={() => setStoryUserId(null)}
          onOpenProfile={openProfile}
        />
      )}
    </div>
  )
}
