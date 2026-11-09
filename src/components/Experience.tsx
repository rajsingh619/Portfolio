import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Briefcase, Flag, GraduationCap, Navigation2, type LucideIcon } from 'lucide-react'
import { education, experience, profile, type Education, type Experience as Job } from '../data/profile'
import Section from './Section'

// ── Build the journey: education + jobs, oldest first ─────────────────────────
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const yearOf = (d: string) => d.match(/\d{4}/)?.[0] ?? d
function sortKey(d: string) {
  const year = Number(d.match(/\d{4}/)?.[0] ?? 0)
  return year * 12 + Math.max(MONTHS.indexOf(d.trim().slice(0, 3).toLowerCase()), 0)
}

type Stop = { key: string; start: string } & ({ kind: 'work'; job: Job } | { kind: 'education'; edu: Education })

const stops: Stop[] = [
  ...education.map((edu) => ({ kind: 'education' as const, key: `edu-${edu.school}`, start: edu.start, edu })),
  ...experience.map((job) => ({ kind: 'work' as const, key: `job-${job.company}-${job.start}`, start: job.start, job })),
].sort((a, b) => sortKey(a.start) - sortKey(b.start))

// The traveller rides on a fixed line 60% down the viewport. A milestone "lights up"
// once it has scrolled above that line — the huge top margin keeps it lit afterwards.
function usePassed() {
  const ref = useRef<HTMLDivElement>(null)
  const passed = useInView(ref, { margin: '100000px 0px -40% 0px' })
  return [ref, passed] as const
}

const GLOW = 'shadow-[0_0_16px_rgba(52,211,153,0.45)]'

// ── Pieces ────────────────────────────────────────────────────────────────────
function Signpost({ lit, children }: { lit: boolean; children: ReactNode }) {
  return (
    <motion.span
      animate={{ scale: lit ? 1 : 0.88 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative z-20 inline-flex items-center rounded-md border px-2 py-1 font-mono text-xs font-semibold transition-colors duration-300 ${
        lit ? `border-accent bg-zinc-950 text-accent ${GLOW}` : 'border-zinc-700 bg-zinc-900 text-zinc-500'
      }`}
    >
      {children}
    </motion.span>
  )
}

function Label({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {children}
    </p>
  )
}

function WorkCard({ job }: { job: Job }) {
  return (
    <>
      <Label icon={Briefcase}>{job.end === 'Present' ? 'Where I am now' : 'Experience'}</Label>
      <h3 className="mt-2 text-lg font-semibold text-white">
        {job.role}{' '}
        <span className="text-accent">
          @{' '}
          {job.companyUrl ? (
            <a href={job.companyUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {job.company}
            </a>
          ) : (
            job.company
          )}
        </span>
      </h3>
      <p className="mt-1 font-mono text-xs text-zinc-500">
        {job.start} — {job.end}
        {job.location && ` · ${job.location}`}
      </p>
      <ul className="mt-4 space-y-2">
        {job.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-zinc-400">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
            {b}
          </li>
        ))}
      </ul>
      {job.tech && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {job.tech.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function EducationCard({ edu, first }: { edu: Education; first: boolean }) {
  return (
    <>
      <Label icon={GraduationCap}>{first ? 'Where it all started' : 'Education'}</Label>
      <h3 className="mt-2 text-lg font-semibold text-white">{edu.degree}</h3>
      <p className="text-sm text-zinc-400">{edu.school}</p>
      <p className="mt-1 font-mono text-xs text-zinc-500">
        {edu.start} — {edu.end}
      </p>
      {edu.details && <p className="mt-3 text-sm text-zinc-400">{edu.details}</p>}
    </>
  )
}

function StopRow({ stop, index }: { stop: Stop; index: number }) {
  const [ref, lit] = usePassed()
  const left = index % 2 === 0

  return (
    <li className="relative pl-16 md:grid md:grid-cols-[1fr_6rem_1fr] md:pl-0">
      {/* year signpost — on the road (left on mobile, centre on desktop) */}
      <div
        ref={ref}
        className="absolute left-5 top-5 -translate-x-1/2 md:static md:col-start-2 md:row-start-1 md:flex md:translate-x-0 md:justify-center md:pt-5"
      >
        <Signpost lit={lit}>{yearOf(stop.start)}</Signpost>
      </div>

      <motion.div
        initial={{ opacity: 0, x: left ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`card p-6 transition-colors duration-500 md:row-start-1 ${left ? 'md:col-start-1' : 'md:col-start-3'} ${
          lit ? 'border-accent/40' : ''
        }`}
      >
        {stop.kind === 'work' ? <WorkCard job={stop.job} /> : <EducationCard edu={stop.edu} first={index === 0} />}
      </motion.div>
    </li>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Experience() {
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 60%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const travelled = useTransform(progress, (v) => `${v * 100}%`)
  const travellerOpacity = useTransform(progress, [0.94, 1], [1, 0])
  const [flagRef, arrived] = usePassed()

  return (
    <Section id="experience" index="01" title="Experience">
      <p className="-mt-6 mb-10 max-w-xl text-zinc-400">The road so far. Scroll to follow along.</p>

      <div ref={track} className="relative pb-16">
        {/* the road */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10 [mask-image:linear-gradient(to_bottom,transparent,black_6%)] md:left-1/2 md:-translate-x-1/2"
        >
          <div className="absolute inset-0 border-x-2 border-zinc-700/60 bg-zinc-900/80" />
          <motion.div className="absolute inset-x-0 top-0 bg-accent/10" style={{ height: travelled }} />
          <div className="road-lane absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 text-zinc-600" />
          <motion.div
            className="road-lane absolute left-1/2 top-0 w-0.5 -translate-x-1/2 text-accent drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]"
            style={{ height: travelled }}
          />
        </div>

        {/* the traveller */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-5 z-10 md:left-1/2"
          style={{ top: travelled, opacity: travellerOpacity }}
        >
          <div className="relative flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/60 bg-zinc-950 shadow-[0_0_24px_rgba(52,211,153,0.5)]">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/20 motion-reduce:animate-none" />
            <Navigation2 className="h-4 w-4 rotate-180 fill-accent text-accent" />
          </div>
        </motion.div>

        {/* milestones */}
        <ol className="relative space-y-16 pt-10 md:space-y-20">
          {stops.map((s, i) => (
            <StopRow key={s.key} stop={s} index={i} />
          ))}
        </ol>

        {/* destination flag at the end of the road */}
        <div ref={flagRef} className="absolute bottom-0 left-5 z-20 -translate-x-1/2 translate-y-1/2 md:left-1/2">
          <motion.div
            animate={{ scale: arrived ? 1.1 : 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
              arrived ? `border-accent bg-accent text-zinc-950 ${GLOW}` : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
          >
            <Flag className="h-4 w-4" aria-hidden="true" />
          </motion.div>
        </div>
      </div>

      {profile.status && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="card ml-16 mt-12 p-6 md:mx-auto md:max-w-md md:text-center"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-accent">Next stop</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Your team?</h3>
          <p className="mt-2 text-sm text-zinc-400">
            I'm looking for my next challenge in software development. Let's build something great together.
          </p>
          <Link to="/#contact" className="btn-primary mt-5">
            Let's talk <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </Section>
  )
}
