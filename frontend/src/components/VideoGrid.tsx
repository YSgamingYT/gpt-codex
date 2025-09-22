import type { Video } from '../types'
import styles from './VideoGrid.module.css'
import { VideoCard } from './VideoCard'

interface VideoGridProps {
  videos: Video[]
  onSelectVideo: (video: Video) => void
  isLoading: boolean
  title: string
  subtitle?: string
  error?: string | null
}

const skeletonItems = Array.from({ length: 8 })

export function VideoGrid({ videos, onSelectVideo, isLoading, title, subtitle, error }: VideoGridProps) {
  return (
    <section className={styles.section}>
      <div className={styles.headingRow}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div className={styles.counter}>{videos.length} videos</div>
      </div>
      {isLoading ? (
        <div className={styles.grid}>
          {skeletonItems.map((_, index) => (
            <div key={index} className={styles.skeleton} />
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className={styles.grid}>
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={onSelectVideo}
              highlight={index === 0}
              showDescription={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>No videos found</h3>
          <p>Try a different search term or explore another category.</p>
        </div>
      )}
    </section>
  )
}
