import { useState } from 'react'
import type { AppState, ArtStyle } from '../types'
import { editProfile } from '../store/store'
import { ART_STYLES } from '../data/art'
import { Avatar } from './Avatar'

interface EditProfileProps {
  state: AppState
  onDone: () => void
}

export function EditProfile({ state, onDone }: EditProfileProps) {
  const me = state.users.find((u) => u.id === state.currentUserId)
  const [displayName, setDisplayName] = useState(me?.displayName ?? '')
  const [bio, setBio] = useState(me?.bio ?? '')
  const [artStyle, setArtStyle] = useState<ArtStyle>(me?.artStyle ?? 'dusk')
  const [error, setError] = useState('')
  if (!me) return null

  const save = () => {
    const ok = editProfile({ displayName, bio, artStyle })
    if (!ok) {
      setError('Display name cannot be empty.')
      return
    }
    onDone()
  }

  return (
    <div className="edit-profile">
      <h1>Edit profile</h1>
      <div className="edit-avatar-row">
        <Avatar username={me.username} artStyle={artStyle} artSeed={me.artSeed} size={64} />
        <span className="edit-avatar-note">Your avatar is generated from your art style — pick a new one below.</span>
      </div>
      <label className="field">
        <span>Display name</span>
        <input type="text" value={displayName} maxLength={60} onChange={(e) => setDisplayName(e.target.value)} />
      </label>
      <label className="field">
        <span>Bio</span>
        <textarea value={bio} maxLength={200} rows={3} onChange={(e) => setBio(e.target.value)} />
      </label>
      <label className="field">
        <span>Avatar / art style</span>
        <select value={artStyle} onChange={(e) => setArtStyle(e.target.value as ArtStyle)}>
          {ART_STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="edit-actions">
        <button type="button" className="btn btn--primary" onClick={save}>Save</button>
        <button type="button" className="btn btn--ghost" onClick={onDone}>Cancel</button>
      </div>
    </div>
  )
}
