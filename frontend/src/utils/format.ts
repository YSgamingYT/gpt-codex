const RELATIVE_TIME_FORMAT = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const VIEW_FORMAT = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatViewCount(count?: number) {
  if (!count) return 'No views yet'
  return `${VIEW_FORMAT.format(count)} views`
}

export function formatCompactNumber(count?: number) {
  if (!count) return '0'
  return VIEW_FORMAT.format(count)
}

export function formatPublishedDate(isoDate: string) {
  if (!isoDate) return 'Unknown date'
  const now = new Date()
  const published = new Date(isoDate)
  const diff = published.getTime() - now.getTime()

  const minutes = Math.round(diff / (1000 * 60))
  const hours = Math.round(diff / (1000 * 60 * 60))
  const days = Math.round(diff / (1000 * 60 * 60 * 24))
  const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30))
  const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365))

  if (Math.abs(minutes) < 60) return RELATIVE_TIME_FORMAT.format(minutes, 'minute')
  if (Math.abs(hours) < 24) return RELATIVE_TIME_FORMAT.format(hours, 'hour')
  if (Math.abs(days) < 30) return RELATIVE_TIME_FORMAT.format(days, 'day')
  if (Math.abs(months) < 12) return RELATIVE_TIME_FORMAT.format(months, 'month')
  return RELATIVE_TIME_FORMAT.format(years, 'year')
}

export function formatDuration(isoDuration?: string) {
  if (!isoDuration) return 'Live'

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return isoDuration

  const hours = Number(match[1] ?? 0)
  const minutes = Number(match[2] ?? 0)
  const seconds = Number(match[3] ?? 0)

  const segments = [hours, minutes, seconds]
  const formatted = segments
    .map((segment) => segment.toString().padStart(2, '0'))
    .slice(hours ? 0 : 1)
    .join(':')

  return formatted.replace(/^0/, '')
}

export function formatDescription(description: string, maxLength = 220) {
  if (description.length <= maxLength) return description
  return `${description.slice(0, maxLength).trim()}…`
}
