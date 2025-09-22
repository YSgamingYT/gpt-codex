import type { Video } from '../types'
import styles from './VideoRail.module.css'
import { VideoCard } from './VideoCard'

interface VideoRailProps {
  videos: Video[]
  onSelectVideo: (video: Video) => void
  isLoading: boolean
  title?: string
}

const skeletons = Array.from({ length: 6 })

export function VideoRail({ videos, onSelectVideo, isLoading, title = 'Recommended for you' }: VideoRailProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      {isLoading ? (
        <div className={styles.skeletonList}>
          {skeletons.map((_, index) => (
            <div key={index} className={styles.skeleton} />
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onSelect={onSelectVideo} compact />
          ))}
        </div>
      )}
    </section>
  )
}
