import { useRef, useState } from 'react'
import type { ArtStyle } from '../types'
import { createPost } from '../store/store'
import { ART_STYLES } from '../data/art'
import { ArtImage } from './ArtImage'

interface CreatePostProps {
  onCreated: (postId: string) => void
}

/**
 * Create a post: upload an image (stored as a data URL, in-memory) or pick
 * a generated sample artwork style, write a caption, optionally attach it
 * to a Loop series ("Day N of M").
 */
export function CreatePost({ onCreated }: CreatePostProps) {
  const [caption, setCaption] = useState('')
  const [style, setStyle] = useState<ArtStyle>('dusk')
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 900) + 100)
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined)
  const [isLoop, setIsLoop] = useState(false)
  const [series, setSeries] = useState('')
  const [day, setDay] = useState(1)
  const [total, setTotal] = useState(7)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const onFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image.')
      return
    }
    if (file.size > 2_000_000) {
      setError('Image is too big — keep it under 2 MB for the demo.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImageDataUrl(String(reader.result))
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const submit = () => {
    if (!caption.trim()) {
      setError('Write a caption first.')
      return
    }
    if (isLoop && !series.trim()) {
      setError('Give your Loop a series name, e.g. “7 days of sketches”.')
      return
    }
    const post = createPost({
      caption,
      artSeed: seed,
      artStyle: style,
      imageDataUrl,
      loop: isLoop
        ? { series: series.trim(), day: Math.max(1, day), total: Math.max(day, total) }
        : undefined,
    })
    onCreated(post.id)
  }

  return (
    <div className="create-post">
      <h1>Create a post</h1>
      <div className="create-preview">
        <ArtImage artStyle={style} artSeed={seed} label="Preview of your post artwork" className="create-art" imageDataUrl={imageDataUrl} />
        <div className="create-actions-row">
          <button type="button" className="btn btn--ghost" onClick={() => fileRef.current?.click()}>
            Upload an image
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setImageDataUrl(undefined)
              setSeed(Math.floor(Math.random() * 900) + 100)
            }}
          >
            🎲 New sample art
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            aria-label="Upload an image"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
      </div>

      <label className="field">
        <span>Artwork style</span>
        <select value={style} onChange={(e) => setStyle(e.target.value as ArtStyle)}>
          {ART_STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Caption</span>
        <textarea
          value={caption}
          maxLength={500}
          rows={3}
          placeholder="What's happening in this one?"
          onChange={(e) => setCaption(e.target.value)}
        />
      </label>

      <label className="field-check">
        <input type="checkbox" checked={isLoop} onChange={(e) => setIsLoop(e.target.checked)} />
        This post is part of a Loop (a repeating series)
      </label>
      {isLoop && (
        <div className="loop-fields">
          <label className="field">
            <span>Series name</span>
            <input type="text" value={series} maxLength={60} placeholder="e.g. 7 days of sketches" onChange={(e) => setSeries(e.target.value)} />
          </label>
          <div className="loop-day-row">
            <label className="field">
              <span>Day</span>
              <input type="number" min={1} max={365} value={day} onChange={(e) => setDay(Number(e.target.value) || 1)} />
            </label>
            <label className="field">
              <span>of</span>
              <input type="number" min={1} max={365} value={total} onChange={(e) => setTotal(Number(e.target.value) || 1)} />
            </label>
          </div>
        </div>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="button" className="btn btn--primary" onClick={submit}>
        Share post
      </button>
    </div>
  )
}
