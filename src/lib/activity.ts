import { cached } from './cache'

export type Level = 0 | 1 | 2 | 3 | 4
export type Day = { date: string; count: number; level: Level }

type Counts = { all: number; easy: number; medium: number; hard: number }

export type LeetCodeData = {
  username: string
  avatar: string | null
  ranking: number | null
  solved: Counts
  total: Counts
  streak: number
  contest: { attended: number; rating: number; topPercentage: number } | null
  calendar: Record<string, number> // YYYY-MM-DD -> submissions
  recent: { title: string; slug: string; at: number }[] // `at` is unix seconds
}

export function fetchLeetCode(username: string) {
  return cached(`lc-cache:${username}`, 15 * 60_000, async () => {
    const res = await fetch(`/api/leetcode?user=${encodeURIComponent(username)}`)
    if (!res.ok) throw new Error('LeetCode request failed')
    return (await res.json()) as LeetCodeData
  })
}

export function levelFor(count: number): Level {
  if (count <= 0) return 0
  if (count <= 2) return 1
  if (count <= 4) return 2
  if (count <= 7) return 3
  return 4
}

// The last 365 days ending today (UTC), oldest first, with zero-filled gaps.
export function lastYearDays(calendar: Record<string, number>): Day[] {
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const days: Day[] = []
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today - i * 86_400_000).toISOString().slice(0, 10)
    const count = calendar[date] ?? 0
    days.push({ date, count, level: levelFor(count) })
  }
  return days
}
