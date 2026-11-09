import { motion } from 'framer-motion'
import { ArrowRight, Download, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { SocialLinks } from './Icons'

// Hero and About in one: the intro doubles as the "about" anchor in the navbar.
export default function Hero() {
  return (
    <section
      id="about"
      className="container-page relative flex min-h-[calc(100vh-4rem)] flex-col justify-center py-20"
    >
      {/* subtle glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="grid items-center gap-12 md:grid-cols-[1fr_260px]"
      >
        <div>
          <p className="font-mono text-sm text-accent">Hi, my name is</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">{profile.name}.</h1>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-500 sm:text-5xl">{profile.title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">{profile.tagline}</p>

          <div className="mt-6 max-w-xl space-y-4 leading-relaxed text-zinc-400">
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {profile.location && (
            <p className="mt-6 flex items-center gap-2 text-sm text-zinc-400">
              <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
              {profile.location}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/#projects" className="btn-primary">
              View my work <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={profile.resumeUrl} download className="btn-ghost">
              <Download className="h-4 w-4" /> Download resume
            </a>
            <Link to="/#contact" className="btn-ghost">
              Contact
            </Link>
          </div>

          <SocialLinks socials={profile.socials} className="mt-10" />
        </div>

        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="aspect-square w-full max-w-[260px] rounded-xl border border-zinc-800 object-cover grayscale transition hover:grayscale-0 md:justify-self-end"
          />
        )}
      </motion.div>
    </section>
  )
}
