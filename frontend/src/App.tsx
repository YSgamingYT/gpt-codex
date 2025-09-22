import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  fetchRelatedVideos,
  fetchTrendingVideos,
  fetchVideoCategories,
  searchVideos,
} from './api/youtube'
import { CategorySidebar } from './components/CategorySidebar'
import { Header } from './components/Header'
import { VideoDetailsPanel } from './components/VideoDetailsPanel'
import { VideoGrid } from './components/VideoGrid'
import { VideoPlayer } from './components/VideoPlayer'
import { VideoRail } from './components/VideoRail'
import type { Video, VideoCategory } from './types'

function App() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<VideoCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [activeQuery, setActiveQuery] = useState<string | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [relatedLoading, setRelatedLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      setCategoriesLoading(true)
      try {
        const fetchedCategories = await fetchVideoCategories()
        if (!cancelled) {
          setCategories(fetchedCategories)
        }
      } catch (apiError) {
        console.error(apiError)
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false)
        }
      }
    }

    loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadVideos() {
      setIsLoading(true)
      setError(null)
      try {
        const fetchedVideos = activeQuery
          ? await searchVideos(activeQuery)
          : await fetchTrendingVideos(selectedCategoryId ?? undefined)

        if (!cancelled) {
          setVideos(fetchedVideos)
          if (fetchedVideos.length > 0) {
            setSelectedVideo((current) => {
              if (current && fetchedVideos.some((video) => video.id === current.id)) {
                return current
              }
              return fetchedVideos[0]
            })
          } else {
            setSelectedVideo(null)
          }
        }
      } catch (apiError) {
        if (!cancelled) {
          setError(apiError instanceof Error ? apiError.message : 'Unable to load videos right now.')
          setVideos([])
          setSelectedVideo(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadVideos()

    return () => {
      cancelled = true
    }
  }, [activeQuery, selectedCategoryId])

  useEffect(() => {
    if (!selectedVideo) {
      setRelatedVideos([])
      return
    }

    let cancelled = false

    const activeVideoId = selectedVideo.id

    async function loadRelated() {
      setRelatedLoading(true)
      try {
        const fetchedRelated = await fetchRelatedVideos(activeVideoId)
        if (!cancelled) {
          setRelatedVideos(fetchedRelated.filter((video) => video.id !== activeVideoId))
        }
      } catch (apiError) {
        console.error(apiError)
        if (!cancelled) {
          setRelatedVideos([])
        }
      } finally {
        if (!cancelled) {
          setRelatedLoading(false)
        }
      }
    }

    loadRelated()

    return () => {
      cancelled = true
    }
  }, [selectedVideo])

  const feedTitle = useMemo(() => {
    if (activeQuery) {
      return `Results for “${activeQuery}”`
    }

    if (selectedCategoryId) {
      const category = categories.find((item) => item.id === selectedCategoryId)
      return category ? `${category.title} spotlight` : 'Featured spotlight'
    }

    return 'For you'
  }, [activeQuery, categories, selectedCategoryId])

  const feedSubtitle = useMemo(() => {
    if (activeQuery) {
      return 'Exploring beyond the usual algorithm. Tap a result to begin playing.'
    }

    if (selectedCategoryId) {
      const category = categories.find((item) => item.id === selectedCategoryId)
      return category
        ? `Fresh drops and hidden gems from ${category.title}.`
        : 'A cinematic feed tailored around this genre.'
    }

    return 'The most loved across the community right now.'
  }, [activeQuery, categories, selectedCategoryId])

  function handleSelectVideo(video: Video) {
    setSelectedVideo(video)
  }

  function handleSearch(term: string) {
    setActiveQuery(term)
  }

  function handleClearSearch() {
    setActiveQuery(null)
    setSelectedCategoryId(null)
  }

  function handleSelectCategory(categoryId: string | null) {
    setSelectedCategoryId(categoryId)
    setActiveQuery(null)
  }

  const highlightedCategory = activeQuery ? '__search__' : selectedCategoryId

  return (
    <div className="app">
      <Header onSearch={handleSearch} activeQuery={activeQuery} onClearSearch={handleClearSearch} />
      <main className="layout">
        <CategorySidebar
          categories={categories}
          selectedCategory={highlightedCategory}
          onSelect={handleSelectCategory}
          isLoading={categoriesLoading}
        />
        <div className="feed">
          <VideoGrid
            videos={videos}
            onSelectVideo={handleSelectVideo}
            isLoading={isLoading}
            title={feedTitle}
            subtitle={feedSubtitle}
            error={error}
          />
        </div>
        <div className="playerPane">
          <VideoPlayer video={selectedVideo} />
          <VideoDetailsPanel video={selectedVideo} />
          <VideoRail
            videos={relatedVideos}
            onSelectVideo={handleSelectVideo}
            isLoading={relatedLoading}
            title="Up next"
          />
        </div>
      </main>
    </div>
  )
}

export default App
