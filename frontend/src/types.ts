export interface ThumbnailSize {
  url: string
  width: number
  height: number
}

export interface VideoStatistics {
  viewCount: number
  likeCount?: number
  commentCount?: number
}

export interface Video {
  id: string
  title: string
  description: string
  channelTitle: string
  channelId: string
  publishedAt: string
  thumbnails: {
    default: ThumbnailSize
    medium: ThumbnailSize
    high: ThumbnailSize
    maxres?: ThumbnailSize
  }
  duration?: string
  statistics?: VideoStatistics
}

export interface VideoCategory {
  id: string
  title: string
}
