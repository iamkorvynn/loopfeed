import { useState } from 'react'
import { getTheme, setTheme, type Theme } from '../utils/theme'

export type View = 'feed' | 'explore' | 'create' | 'messages' | 'notifications' | 'profile' | 'search'

interface NavBarProps {
  view: View
  onNavigate: (view: View) => void
  unreadDms: number
  unreadNotifs: number
  onResetDemo: () => void
}

const ITEMS: { view: View; label: string; icon: string }[] = [
  { view: 'feed', label: 'Home', icon: '🏠' },
  { view: 'search', label: 'Search', icon: '🔍' },
  { view: 'explore', label: 'Explore', icon: '🧭' },
  { view: 'create', label: 'Create', icon: '＋' },
  { view: 'messages', label: 'Messages', icon: '✉️' },
  { view: 'notifications', label: 'Notifications', icon: '🔔' },
  { view: 'profile', label: 'Profile', icon: '👤' },
]

/** Top navigation bar with unread badges, dark-mode toggle and demo reset. */
export function NavBar({ view, onNavigate, unreadDms, unreadNotifs, onResetDemo }: NavBarProps) {
  const [theme, setThemeState] = useState<Theme>(() => getTheme())
  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }
  return (
    <header className="navbar">
      <button type="button" className="brand" onClick={() => onNavigate('feed')} aria-label="LoopFeed home">
        <span className="brand-mark" aria-hidden="true">◐</span>
        <span className="brand-name">LoopFeed</span>
      </button>
      <nav className="nav-items" aria-label="Main navigation">
        {ITEMS.map((item) => (
          <button
            key={item.view}
            type="button"
            className={`nav-item${view === item.view ? ' nav-item--active' : ''}`}
            aria-current={view === item.view ? 'page' : undefined}
            onClick={() => onNavigate(item.view)}
          >
            <span aria-hidden="true">{item.icon}</span> {item.label}
            {item.view === 'messages' && unreadDms > 0 && (
              <span className="badge" aria-label={`${unreadDms} unread messages`}>{unreadDms}</span>
            )}
            {item.view === 'notifications' && unreadNotifs > 0 && (
              <span className="badge" aria-label={`${unreadNotifs} unread notifications`}>{unreadNotifs}</span>
            )}
          </button>
        ))}
      </nav>
      <button
        type="button"
        className="reset-btn"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title="Toggle dark mode"
      >
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>
      <button
        type="button"
        className="reset-btn"
        onClick={onResetDemo}
        title="Reset the demo data to its original seeded state"
      >
        Reset demo
      </button>
    </header>
  )
}
