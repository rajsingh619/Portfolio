import { useEffect, useMemo, useRef } from 'react'
import { useInView } from 'framer-motion'
import type { Day } from '../lib/activity'

const CELL = 11
const GAP = 3
const PITCH = CELL + GAP
const TOP = 18 // room for month labels

type Props = {
  days: Day[] // oldest first, consecutive
  palette: string[] // 5 colours for levels 0–4
  unit: string // singular noun, e.g. "contribution"
  label: string // accessible description
}

const monthName = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export default function ContributionGraph({ days, palette, unit, label }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const inView = useInView(scroller, { once: true, margin: '-60px' })

  // Columns are weeks (Sunday first), like GitHub's own graph.
  const { weeks, months } = useMemo(() => {
    const weeks: (Day | null)[][] = []
    let week: (Day | null)[] = []
    const lead = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0
    for (let i = 0; i < lead; i++) week.push(null)
    for (const d of days) {
      week.push(d)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    if (week.length) weeks.push(week)

    const months = weeks.flatMap((w, i) => {
      const first = w.find((d) => d?.date.endsWith('-01'))
      return first ? [{ i, name: monthName(first.date) }] : []
    })
    return { weeks, months }
  }, [days])

  // Start scrolled to today on narrow screens.
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [weeks])

  return (
    <div>
      <div ref={scroller} className="overflow-x-auto pb-2">
        <svg
          width={weeks.length * PITCH - GAP}
          height={TOP + 7 * PITCH - GAP}
          role="img"
          aria-label={label}
          className="block"
        >
          {months.map((m) => (
            <text key={m.i} x={m.i * PITCH} y={10} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#71717a">
              {m.name}
            </text>
          ))}
          {weeks.map((w, wi) =>
            w.map(
              (d, di) =>
                d && (
                  <rect
                    key={d.date}
                    x={wi * PITCH}
                    y={TOP + di * PITCH}
                    width={CELL}
                    height={CELL}
                    rx={2}
                    fill={palette[d.level]}
                    className={inView ? 'cell-in' : 'opacity-0'}
                    style={{ animationDelay: `${wi * 12}ms` }}
                  >
                    <title>{`${d.count === 0 ? 'No' : d.count} ${unit}${d.count === 1 ? '' : 's'} on ${longDate(d.date)}`}</title>
                  </rect>
                ),
            ),
          )}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5 font-mono text-[10px] text-zinc-500">
        Less
        {palette.map((c, i) => (
          <span key={i} className="h-[11px] w-[11px] rounded-sm" style={{ background: c }} />
        ))}
        More
      </div>
    </div>
  )
}
