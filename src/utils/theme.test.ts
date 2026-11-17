import { describe, it, expect, beforeEach } from 'vitest'
import { applyStoredTheme, getTheme, setTheme } from './theme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('theme', () => {
  it('defaults to light', () => {
    expect(getTheme()).toBe('light')
  })

  it('persists the choice and sets data-theme', () => {
    setTheme('dark')
    expect(getTheme()).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    setTheme('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('applyStoredTheme restores the saved theme', () => {
    localStorage.setItem('loopfeed-theme', 'dark')
    expect(applyStoredTheme()).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
