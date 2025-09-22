import { useState } from 'react'
import type { Video } from '../types'
import { formatCompactNumber, formatDescription, formatPublishedDate, formatViewCount } from '../utils/format'
import styles from './VideoDetailsPanel.module.css'

interface VideoDetailsPanelProps {
  video: Video | null
}

export function VideoDetailsPanel({ video }: VideoDetailsPanelProps) {
  const [expanded, setExpanded] = useState(false)

  if (!video) {
    return null
  }

  const likeCount = video.statistics?.likeCount
  const commentCount = video.statistics?.commentCount

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>{video.title}</h2>
        <a
          className={styles.cta}
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noreferrer"
        >
          Watch on YouTube ↗
        </a>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.channel}>{video.channelTitle}</span>
        <span>•</span>
        <span>{formatViewCount(video.statistics?.viewCount)}</span>
        <span>•</span>
        <span>{formatPublishedDate(video.publishedAt)}</span>
      </div>
      <div className={styles.statChips}>
        {likeCount !== undefined && <span>👍 {formatCompactNumber(likeCount)} likes</span>}
        {commentCount !== undefined && <span>💬 {formatCompactNumber(commentCount)} comments</span>}
      </div>
      <p className={styles.description}>
        {expanded ? video.description : formatDescription(video.description, 280)}
      </p>
      {video.description.length > 280 && (
        <button className={styles.toggle} onClick={() => setExpanded((value) => !value)} type="button">
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
