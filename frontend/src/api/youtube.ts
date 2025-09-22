import type { Video, VideoCategory, VideoStatistics } from '../types'

const API_BASE = 'https://www.googleapis.com/youtube/v3'
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

interface YoutubeListResponse<T> {
  items: T[]
}

interface YoutubeSnippet {
  title?: string
  description?: string
  channelTitle?: string
  channelId?: string
  publishedAt?: string
  thumbnails?: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
    maxres?: { url: string; width: number; height: number }
  }
}

interface YoutubeVideoStatisticsRaw {
  viewCount?: string
  likeCount?: string
  commentCount?: string
}

interface YoutubeVideoItem {
  id: string
  snippet: YoutubeSnippet
  contentDetails?: {
    duration?: string
  }
  statistics?: YoutubeVideoStatisticsRaw
}

interface YoutubeSearchItem {
  id: { videoId: string } | string
  snippet: YoutubeSnippet
}

interface YoutubeCategoryItem {
  id: string
  snippet: {
    title: string
    assignable: boolean
  }
}

function ensureApiKey() {
  if (!API_KEY) {
    throw new Error('Missing YouTube API key. Define VITE_YOUTUBE_API_KEY in your environment.')
  }
}

async function fetchFromYoutube<T>(endpoint: string, params: Record<string, string | number | undefined>) {
  ensureApiKey()
  const url = new URL(`${API_BASE}/${endpoint}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })

  url.searchParams.set('key', API_KEY)

  const response = await fetch(url.toString())

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`YouTube API error (${response.status}): ${message}`)
  }

  return (await response.json()) as T
}

function parseStatistics(stats?: YoutubeVideoStatisticsRaw): VideoStatistics | undefined {
  if (!stats) return undefined

  const viewCount = Number(stats.viewCount ?? 0)
  const likeCount = stats.likeCount !== undefined ? Number(stats.likeCount) : undefined
  const commentCount = stats.commentCount !== undefined ? Number(stats.commentCount) : undefined

  return {
    viewCount,
    likeCount,
    commentCount,
  }
}

function transformVideo(item: YoutubeVideoItem): Video {
  const id = item.id

  return {
    id,
    title: item.snippet?.title ?? 'Untitled video',
    description: item.snippet?.description ?? '',
    channelTitle: item.snippet?.channelTitle ?? 'Unknown creator',
    channelId: item.snippet?.channelId ?? '',
    publishedAt: item.snippet?.publishedAt ?? '',
    thumbnails: item.snippet?.thumbnails ?? {
      default: { url: '', width: 0, height: 0 },
      medium: { url: '', width: 0, height: 0 },
      high: { url: '', width: 0, height: 0 },
    },
    duration: item.contentDetails?.duration,
    statistics: parseStatistics(item.statistics),
  }
}

async function fetchVideosByIds(ids: string[]): Promise<Video[]> {
  if (!ids.length) return []

  const { items } = await fetchFromYoutube<YoutubeListResponse<YoutubeVideoItem>>('videos', {
    part: 'snippet,contentDetails,statistics',
    id: ids.join(','),
    maxResults: ids.length,
  })

  return items.map(transformVideo)
}

export async function fetchTrendingVideos(categoryId?: string, maxResults = 24): Promise<Video[]> {
  const { items } = await fetchFromYoutube<YoutubeListResponse<YoutubeVideoItem>>('videos', {
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    maxResults,
    regionCode: 'US',
    videoCategoryId: categoryId,
  })

  return items.map(transformVideo)
}

export async function searchVideos(query: string, maxResults = 24): Promise<Video[]> {
  const { items } = await fetchFromYoutube<YoutubeListResponse<YoutubeSearchItem>>('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults,
  })

  const ids = items
    .map((item) => (typeof item.id === 'object' ? item.id.videoId : item.id))
    .filter((value): value is string => Boolean(value))

  const detailedVideos = await fetchVideosByIds(ids)
  const orderedMap = new Map(detailedVideos.map((video) => [video.id, video]))

  return ids.map((id) => orderedMap.get(id)).filter((video): video is Video => Boolean(video))
}

export async function fetchVideoDetails(videoId: string): Promise<Video | null> {
  const videos = await fetchVideosByIds([videoId])
  return videos[0] ?? null
}

export async function fetchRelatedVideos(videoId: string, maxResults = 16): Promise<Video[]> {
  const { items } = await fetchFromYoutube<YoutubeListResponse<YoutubeSearchItem>>('search', {
    part: 'snippet',
    type: 'video',
    relatedToVideoId: videoId,
    maxResults,
  })

  const ids = items
    .map((item) => (typeof item.id === 'object' ? item.id.videoId : item.id))
    .filter((value): value is string => Boolean(value))

  return fetchVideosByIds(ids)
}

export async function fetchVideoCategories(): Promise<VideoCategory[]> {
  const { items } = await fetchFromYoutube<YoutubeListResponse<YoutubeCategoryItem>>('videoCategories', {
    part: 'snippet',
    regionCode: 'US',
  })

  return items
    .filter((item) => item.snippet?.assignable)
    .map((item) => ({
      id: item.id,
      title: item.snippet.title,
    }))
    .sort((a: VideoCategory, b: VideoCategory) => a.title.localeCompare(b.title))
}
