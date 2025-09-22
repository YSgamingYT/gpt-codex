import type { FormEvent } from 'react'
import { useState } from 'react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  onSearch: (term: string) => void
  placeholder?: string
  initialValue?: string
}

export function SearchBar({ onSearch, placeholder = 'Search anything…', initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = value.trim()
    if (trimmed.length === 0) return
    onSearch(trimmed)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <label className="sr-only" htmlFor="search-input">
        Search for videos
      </label>
      <input
        id="search-input"
        className={styles.input}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Search videos"
      />
      <button className={styles.button} type="submit">
        <span className="sr-only">Search</span>
        🔍
      </button>
    </form>
  )
}
