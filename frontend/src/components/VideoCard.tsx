import clsx from 'clsx'
import type { KeyboardEvent } from 'react'
import type { Video } from '../types'
import { formatDescription, formatDuration, formatPublishedDate, formatViewCount } from '../utils/format'
import styles from './VideoCard.module.css'

interface VideoCardProps {
  video: Video
  onSelect: (video: Video) => void
  compact?: boolean
  highlight?: boolean
  showDescription?: boolean
}

export function VideoCard({ video, onSelect, compact = false, highlight = false, showDescription = false }: VideoCardProps) {
  function handleActivate() {
    onSelect(video)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(video)
    }
  }

  const thumbnail =
    video.thumbnails.maxres ?? video.thumbnails.high ?? video.thumbnails.medium ?? video.thumbnails.default
  const thumbnailUrl = thumbnail?.url || 'https://placehold.co/480x270?text=Video'

  return (
    <div
      className={clsx(styles.card, compact && styles.compact, highlight && styles.highlight)}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.thumbnailWrapper}>
        <img className={styles.thumbnail} src={thumbnailUrl} alt={video.title} loading="lazy" />
        <span className={styles.duration}>{formatDuration(video.duration)}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{video.title}</h3>
        <div className={styles.meta}>
          <span>{video.channelTitle}</span>
          <span>•</span>
          <span>{formatViewCount(video.statistics?.viewCount)}</span>
          <span>•</span>
          <span>{formatPublishedDate(video.publishedAt)}</span>
        </div>
        {showDescription && <p className={styles.description}>{formatDescription(video.description, 160)}</p>}
      </div>
    </div>
  )
}
