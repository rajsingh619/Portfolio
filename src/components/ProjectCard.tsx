import { ExternalLink, Folder } from 'lucide-react'
import type { Project } from '../data/profile'
import { GitHubIcon } from './Icons'

function Links({ p }: { p: Project }) {
  return (
    <div className="flex items-center gap-3">
      {p.github && (
        <a href={p.github} target="_blank" rel="noreferrer" aria-label={`${p.title} source code`} className="link">
          <GitHubIcon className="h-5 w-5" />
        </a>
      )}
      {p.live && (
        <a href={p.live} target="_blank" rel="noreferrer" aria-label={`${p.title} live demo`} className="link">
          <ExternalLink className="h-5 w-5" />
        </a>
      )}
    </div>
  )
}

function Tech({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tech.map((t) => (
        <li key={t} className="font-mono text-xs text-zinc-500">
          {t}
        </li>
      ))}
    </ul>
  )
}

export function FeaturedProjectCard({ p }: { p: Project }) {
  return (
    <article className="card group overflow-hidden transition-colors hover:border-zinc-700">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
        {p.image ? (
          <img
            src={p.image}
            alt={`${p.title} screenshot`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-2xl font-semibold text-zinc-700">
            {p.title}
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-accent">Featured project</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{p.title}</h3>
          </div>
          <Links p={p} />
        </div>
        <p className="text-sm leading-relaxed text-zinc-400">{p.description}</p>
        <Tech tech={p.tech} />
      </div>
    </article>
  )
}

export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="card flex h-full flex-col p-5 transition hover:-translate-y-1 hover:border-zinc-700">
      <div className="mb-4 flex items-center justify-between">
        <Folder className="h-7 w-7 text-accent" aria-hidden="true" />
        <Links p={p} />
      </div>
      <h3 className="font-semibold text-white">{p.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{p.description}</p>
      <div className="mt-4">
        <Tech tech={p.tech} />
      </div>
    </article>
  )
}
