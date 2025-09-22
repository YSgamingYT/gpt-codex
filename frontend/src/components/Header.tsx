import type { KeyboardEvent } from 'react'
import styles from './Header.module.css'
import { SearchBar } from './SearchBar'

interface HeaderProps {
  onSearch: (term: string) => void
  activeQuery?: string | null
  onClearSearch: () => void
}

export function Header({ onSearch, activeQuery, onClearSearch }: HeaderProps) {
  function handleBrandingKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClearSearch()
    }
  }

  return (
    <header className={styles.header}>
      <div
        className={styles.branding}
        onClick={onClearSearch}
        role="button"
        tabIndex={0}
        onKeyDown={handleBrandingKeyDown}
      >
        <div className={styles.logo}>NovaTube</div>
        <p className={styles.tagline}>Stream smarter with a calmer, curated player.</p>
      </div>
      <SearchBar onSearch={onSearch} placeholder="Search videos, creators, or moods…" />
      {activeQuery ? (
        <button className={styles.resetButton} onClick={onClearSearch} type="button">
          Clear search
        </button>
      ) : (
        <div className={styles.placeholderSpace} aria-hidden="true" />
      )}
    </header>
  )
}
