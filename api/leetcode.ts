// Serverless endpoint: GET /api/leetcode?user=<username>
//
// LeetCode's GraphQL API doesn't allow requests from browsers (no CORS), so the site
// calls this function instead. On Vercel it runs as a serverless function; in local
// development vite.config.ts mounts the very same file. Keep it self-contained (no
// relative imports) so both environments can load it.

type Req = { url?: string }
type Res = {
  statusCode: number
  setHeader(name: string, value: string): unknown
  end(body: string): unknown
}

const QUERY = `
query u($username: String!, $cur: Int, $prev: Int) {
  matchedUser(username: $username) {
    profile { ranking userAvatar }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    cur: userCalendar(year: $cur) { streak submissionCalendar }
    prev: userCalendar(year: $prev) { submissionCalendar }
  }
  userContestRanking(username: $username) { attendedContestsCount rating topPercentage }
  allQuestionsCount { difficulty count }
  recentAcSubmissionList(username: $username, limit: 5) { title titleSlug timestamp }
}`

type Counted = { difficulty: string; count: number }

const send = (res: Res, status: number, body: unknown, cache = 'no-store') => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', cache)
  res.end(JSON.stringify(body))
}

const counts = (list: Counted[] = []) => {
  const get = (d: string) => list.find((x) => x.difficulty === d)?.count ?? 0
  return { all: get('All'), easy: get('Easy'), medium: get('Medium'), hard: get('Hard') }
}

// LeetCode returns { "<unix seconds at UTC midnight>": submissions } as a JSON string.
function mergeCalendar(raw: unknown, into: Record<string, number>) {
  if (typeof raw !== 'string') return
  const calendar = JSON.parse(raw) as Record<string, number>
  for (const [ts, count] of Object.entries(calendar)) {
    const date = new Date(Number(ts) * 1000).toISOString().slice(0, 10)
    into[date] = (into[date] ?? 0) + count
  }
}

export default async function handler(req: Req, res: Res) {
  const user = new URL(req.url ?? '', 'http://localhost').searchParams.get('user') ?? ''
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(user)) return send(res, 400, { error: 'Invalid username' })

  const year = new Date().getUTCFullYear()
  try {
    const upstream = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (portfolio-site)',
      },
      body: JSON.stringify({ query: QUERY, variables: { username: user, cur: year, prev: year - 1 } }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!upstream.ok) return send(res, 502, { error: `LeetCode responded with ${upstream.status}` })

    const { data } = (await upstream.json()) as { data?: any }
    const u = data?.matchedUser
    if (!u) return send(res, 404, { error: 'LeetCode user not found' })

    const calendar: Record<string, number> = {}
    mergeCalendar(u.prev?.submissionCalendar, calendar)
    mergeCalendar(u.cur?.submissionCalendar, calendar)
    const cutoff = new Date(Date.now() - 370 * 86_400_000).toISOString().slice(0, 10)
    for (const date of Object.keys(calendar)) if (date < cutoff) delete calendar[date]

    const contest = data.userContestRanking
    const body = {
      username: user,
      avatar: u.profile?.userAvatar ?? null,
      ranking: u.profile?.ranking ?? null,
      solved: counts(u.submitStatsGlobal?.acSubmissionNum),
      total: counts(data.allQuestionsCount),
      streak: u.cur?.streak ?? 0,
      contest: contest
        ? { attended: contest.attendedContestsCount, rating: Math.round(contest.rating), topPercentage: contest.topPercentage }
        : null,
      calendar,
      recent: (data.recentAcSubmissionList ?? []).map((s: { title: string; titleSlug: string; timestamp: string }) => ({
        title: s.title,
        slug: s.titleSlug,
        at: Number(s.timestamp),
      })),
    }
    // Cached at the edge for 15 min, then served stale for up to an hour while refreshing.
    return send(res, 200, body, 'public, s-maxage=900, stale-while-revalidate=3600')
  } catch {
    return send(res, 502, { error: 'Could not reach LeetCode' })
  }
}
