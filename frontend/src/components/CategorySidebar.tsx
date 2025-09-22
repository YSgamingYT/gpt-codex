import clsx from 'clsx'
import styles from './CategorySidebar.module.css'
import type { VideoCategory } from '../types'

interface CategorySidebarProps {
  categories: VideoCategory[]
  selectedCategory: string | null
  onSelect: (categoryId: string | null) => void
  isLoading: boolean
}

const curatedCollections: Array<{ id: string | null; label: string; description: string }> = [
  { id: null, label: 'For you', description: 'A tailored mix of what is trending now.' },
  { id: '10', label: 'Music Lounge', description: 'Live sets, remixes, and sonic journeys.' },
  { id: '20', label: 'Gaming Worlds', description: 'Speedruns, esports, and deep dives.' },
  { id: '24', label: 'Cinema Club', description: 'Short films, trailers, and storytelling.' },
  { id: '17', label: 'Wellness', description: 'Mindfulness, workouts, and slow living.' },
]

export function CategorySidebar({ categories, selectedCategory, onSelect, isLoading }: CategorySidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.heading}>Curated Feeds</h2>
      <div className={styles.curatedList}>
        {curatedCollections.map((collection) => (
          <button
            key={collection.label}
            className={clsx(styles.curatedCard, selectedCategory === collection.id && styles.active)}
            onClick={() => onSelect(collection.id)}
            type="button"
          >
            <span className={styles.curatedLabel}>{collection.label}</span>
            <span className={styles.curatedDescription}>{collection.description}</span>
          </button>
        ))}
      </div>
      <div className={styles.sectionHeader}>
        <h3>Browse all categories</h3>
        {isLoading && <span className={styles.loading}>Fetching genres…</span>}
      </div>
      <div className={styles.categoryChips}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={clsx(styles.chip, selectedCategory === category.id && styles.activeChip)}
            onClick={() => onSelect(category.id)}
            type="button"
          >
            {category.title}
          </button>
        ))}
      </div>
    </aside>
  )
}
