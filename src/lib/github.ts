import { cached } from './cache'
import type { Day } from './activity'

export type GitHubUser = {
  login: string
  public_repos: number
  followers: number
  html_url: string
}

export type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  fork: boolean
}

export type GitHubData = {
  user: GitHubUser
  repos: GitHubRepo[]
}

// Unauthenticated GitHub API allows 60 requests/hour per IP, so cache per visitor.
export function fetchGitHub(username: string) {
  return cached(`gh-cache:${username}`, 30 * 60_000, async (): Promise<GitHubData> => {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`),
    ])
    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed')
    return { user: await userRes.json(), repos: await reposRes.json() }
  })
}

// The contribution calendar isn't in GitHub's public REST API (it needs a token), so this
// reads it from the open github-contributions-api, which scrapes the public profile.
export function fetchContributions(username: string) {
  return cached(`gh-contrib:${username}`, 30 * 60_000, async () => {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
    if (!res.ok) throw new Error('Contribution request failed')
    const json = (await res.json()) as { total: { lastYear: number }; contributions: Day[] }
    return { total: json.total.lastYear, days: json.contributions }
  })
}
