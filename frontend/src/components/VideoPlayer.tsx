import type { Video } from '../types'
import styles from './VideoPlayer.module.css'

interface VideoPlayerProps {
  video: Video | null
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  if (!video) {
    return (
      <div className={styles.placeholder}>
        <h2>Select a video to start playing</h2>
        <p>Discover something new from the curated feeds on the left.</p>
      </div>
    )
  }

  return (
    <div className={styles.playerWrapper}>
      <iframe
        className={styles.iframe}
        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
