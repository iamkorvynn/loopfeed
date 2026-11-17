/** Theme (light/dark) persisted in localStorage, applied via data-theme. */

export type Theme = 'light' | 'dark'

const THEME_KEY = 'loopfeed-theme'

export function getTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // ignore
  }
  document.documentElement.setAttribute('data-theme', theme)
}

export function applyStoredTheme(): Theme {
  const theme = getTheme()
  document.documentElement.setAttribute('data-theme', theme)
  return theme
}
