import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ExternalLink, Flame, GitFork, Star, TrendingUp, Trophy, type LucideIcon } from 'lucide-react'
import { SiLeetcode } from 'react-icons/si'
import { profile } from '../data/profile'
import { fetchContributions, fetchGitHub } from '../lib/github'
import { fetchLeetCode, lastYearDays, type LeetCodeData } from '../lib/activity'
import ContributionGraph from './ContributionGraph'
import { GitHubIcon } from './Icons'
import Section from './Section'

const GH_PALETTE = ['#27272a', '#064e3b', '#047857', '#10b981', '#34d399']
const LC_PALETTE = ['#27272a', '#5c3a0b', '#9a5b0c', '#d98a10', '#ffa116']
const LC_COLORS = { easy: '#00b8a3', medium: '#ffc01e', hard: '#ef4743' }
const LC_ORANGE = '#ffa116'

const fmt = (n: number) => n.toLocaleString('en-US')

function timeAgo(ms: number) {
  const days = Math.floor((Date.now() - ms) / 86_400_000)
  if (days < 1) return 'today'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

// Each data source loads independently, so one failing never blanks the others.
function useLoad<T>(load: () => Promise<T>) {
  const [state, setState] = useState<{ data?: T; error?: boolean }>({})
  useEffect(() => {
    let alive = true
    load()
      .then((data) => alive && setState({ data }))
      .catch(() => alive && setState({ error: true }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return state
}

// ── shared bits ───────────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-lg bg-zinc-800/60 ${className}`} />
)

function Stat({ icon: Icon, label, value, sub, color }: { icon: LucideIcon; label: string; value: ReactNode; sub?: string; color: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
        <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
    </div>
  )
}

function CardHeader({ icon, title, handle, href, summary }: { icon: ReactNode; title: string; handle: string; href: string; summary?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <a href={href} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1 text-xs">
            @{handle} <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
      {summary && <p className="text-sm text-zinc-400">{summary}</p>}
    </div>
  )
}

function Unavailable({ name, href }: { name: string; href: string }) {
  return (
    <p className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-400">
      Couldn't load live {name} data right now.{' '}
      <a href={href} target="_blank" rel="noreferrer" className="text-accent hover:underline">
        View the profile directly →
      </a>
    </p>
  )
}

// ── GitHub ────────────────────────────────────────────────────────────────────
function GitHubBlock() {
  const username = profile.githubUsername
  const url = `https://github.com/${username}`
  const account = useLoad(() => fetchGitHub(username))
  const contrib = useLoad(() => fetchContributions(username))

  const repos = useMemo(() => (account.data?.repos ?? []).filter((r) => !r.fork), [account.data])
  const stars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const recent = useMemo(() => [...repos].sort((a, b) => b.pushed_at.localeCompare(a.pushed_at)).slice(0, 6), [repos])

  return (
    <div className="card p-6">
      <CardHeader
        icon={<GitHubIcon className="h-8 w-8 text-white" />}
        title="GitHub"
        handle={username}
        href={url}
        summary={
          contrib.data && (
            <>
              <span className="font-semibold text-white">{fmt(contrib.data.total)}</span> contributions in the last year
            </>
          )
        }
      />

      {contrib.error ? (
        <Unavailable name="contribution" href={url} />
      ) : contrib.data ? (
        <ContributionGraph
          days={contrib.data.days}
          palette={GH_PALETTE}
          unit="contribution"
          label={`GitHub contribution graph: ${contrib.data.total} contributions in the last year`}
        />
      ) : (
        <Skeleton className="h-[140px]" />
      )}

      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: 'Public repos', value: account.data?.user.public_repos },
          { label: 'Stars earned', value: account.data ? stars : undefined },
          { label: 'Followers', value: account.data?.user.followers },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <p className="text-2xl font-semibold tabular-nums text-white">
              {s.value ?? <span className="inline-block h-7 w-10 animate-pulse rounded bg-zinc-800" />}
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <h4 className="mb-4 mt-8 font-mono text-xs uppercase tracking-wider text-zinc-500">Recently active repositories</h4>
      {account.error ? (
        <Unavailable name="repository" href={url} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {account.data
            ? recent.map((r) => (
                <a
                  key={r.id}
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 transition hover:-translate-y-0.5 hover:border-zinc-600"
                >
                  <p className="truncate font-mono text-sm font-medium text-white">{r.name}</p>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-400">{r.description ?? 'No description'}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
                    {r.language && <span>{r.language}</span>}
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" aria-hidden="true" /> {r.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" aria-hidden="true" /> {r.forks_count}
                    </span>
                    <span className="ml-auto">{timeAgo(new Date(r.pushed_at).getTime())}</span>
                  </div>
                </a>
              ))
            : Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      )}
    </div>
  )
}

// ── LeetCode ──────────────────────────────────────────────────────────────────
function DifficultyBar({ label, solved, total, color }: { label: string; solved: number; total: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span style={{ color }}>{label}</span>
        <span className="font-mono text-xs text-zinc-400">
          <span className="text-white">{solved}</span> / {fmt(total)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${total ? Math.max((solved / total) * 100, 1.5) : 0}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

function LeetCodeStats({ data }: { data: LeetCodeData }) {
  const days = useMemo(() => lastYearDays(data.calendar), [data.calendar])
  const submissions = days.reduce((s, d) => s + d.count, 0)
  const activeDays = days.filter((d) => d.count > 0).length

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={CheckCircle2} color={LC_ORANGE} label="Problems solved" value={data.solved.all} sub={`of ${fmt(data.total.all)}`} />
        <Stat icon={Flame} color={LC_ORANGE} label="Current streak" value={`${data.streak} days`} sub={`${activeDays} active days this year`} />
        <Stat
          icon={Trophy}
          color={LC_ORANGE}
          label="Contest rating"
          value={data.contest ? fmt(data.contest.rating) : '—'}
          sub={data.contest ? `${data.contest.attended} contests · top ${data.contest.topPercentage.toFixed(1)}%` : 'No contests yet'}
        />
        <Stat icon={TrendingUp} color={LC_ORANGE} label="Global rank" value={data.ranking ? `#${fmt(data.ranking)}` : '—'} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <DifficultyBar label="Easy" solved={data.solved.easy} total={data.total.easy} color={LC_COLORS.easy} />
        <DifficultyBar label="Medium" solved={data.solved.medium} total={data.total.medium} color={LC_COLORS.medium} />
        <DifficultyBar label="Hard" solved={data.solved.hard} total={data.total.hard} color={LC_COLORS.hard} />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm text-zinc-400">
          <span className="font-semibold text-white">{fmt(submissions)}</span> submissions in the last year
        </p>
        <ContributionGraph
          days={days}
          palette={LC_PALETTE}
          unit="submission"
          label={`LeetCode submission graph: ${submissions} submissions in the last year`}
        />
      </div>
    </>
  )
}

function LeetCodeBlock() {
  const username = profile.leetcodeUsername
  const url = `https://leetcode.com/u/${username}/`
  const { data, error } = useLoad(() => fetchLeetCode(username))

  return (
    <div className="card p-6">
      <CardHeader icon={<SiLeetcode className="h-8 w-8" style={{ color: LC_ORANGE }} aria-hidden="true" />} title="LeetCode" handle={username} href={url} />
      {error ? (
        <Unavailable name="LeetCode" href={url} />
      ) : data ? (
        <LeetCodeStats data={data} />
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-[140px]" />
        </div>
      )}
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function CodingActivity() {
  return (
    <Section id="activity" index="04" title="Coding Activity">
      <p className="-mt-6 mb-10 max-w-xl text-zinc-400">
        Live from GitHub and LeetCode: what I've been building and practising lately.
      </p>
      <div className="space-y-6">
        <GitHubBlock />
        <LeetCodeBlock />
      </div>
    </Section>
  )
}
