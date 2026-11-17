import { useState } from 'react'
import type { ArtStyle } from '../types'
import { addStory } from '../store/store'
import { ART_STYLES } from '../data/art'
import { ArtImage } from './ArtImage'

interface StoryComposerProps {
  onPosted: (userId: string) => void
  onCancel: () => void
}

/** Post a story: caption + generated art, optionally with a 2-option poll. */
export function StoryComposer({ onPosted, onCancel }: StoryComposerProps) {
  const [caption, setCaption] = useState('')
  const [style, setStyle] = useState<ArtStyle>('dusk')
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 900) + 100)
  const [withPoll, setWithPoll] = useState(false)
  const [question, setQuestion] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!caption.trim()) {
      setError('Write a caption for your story first.')
      return
    }
    if (withPoll && (!question.trim() || !optionA.trim() || !optionB.trim())) {
      setError('A poll needs a question and both options.')
      return
    }
    const story = addStory({
      caption,
      artSeed: seed,
      artStyle: style,
      poll: withPoll
        ? { question, options: [optionA.trim(), optionB.trim()] }
        : undefined,
    })
    onPosted(story.userId)
  }

  return (
    <div className="story-composer" role="dialog" aria-label="Post a story">
      <h2>Post a story</h2>
      <p className="story-composer-note">Stories disappear after 24 hours.</p>
      <ArtImage artStyle={style} artSeed={seed} label="Preview of your story artwork" className="create-art" />
      <div className="create-actions-row">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setSeed(Math.floor(Math.random() * 900) + 100)}
        >
          🎲 New sample art
        </button>
        <label className="field" style={{ flex: 1, marginBottom: 0 }}>
          <span>Artwork style</span>
          <select value={style} onChange={(e) => setStyle(e.target.value as ArtStyle)}>
            {ART_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Caption</span>
        <input type="text" value={caption} maxLength={200} placeholder="What's happening?" onChange={(e) => setCaption(e.target.value)} />
      </label>
      <label className="field-check">
        <input type="checkbox" checked={withPoll} onChange={(e) => setWithPoll(e.target.checked)} />
        Ask a poll question (2 options)
      </label>
      {withPoll && (
        <div className="loop-fields">
          <label className="field">
            <span>Question</span>
            <input type="text" value={question} maxLength={140} placeholder="e.g. Which one should I ship?" onChange={(e) => setQuestion(e.target.value)} />
          </label>
          <label className="field">
            <span>Option 1</span>
            <input type="text" value={optionA} maxLength={60} onChange={(e) => setOptionA(e.target.value)} />
          </label>
          <label className="field">
            <span>Option 2</span>
            <input type="text" value={optionB} maxLength={60} onChange={(e) => setOptionB(e.target.value)} />
          </label>
        </div>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="edit-actions">
        <button type="button" className="btn btn--primary" onClick={submit}>Post story</button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
