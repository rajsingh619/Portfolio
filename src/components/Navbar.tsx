import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/profile'

const links = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'activity', label: 'Activity' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight the section currently in view
  useEffect(() => {
    if (!onHome) return setActive('')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [onHome])

  useEffect(() => setOpen(false), [pathname])

  const navItem = (id: string, label: string) => (
    <Link
      key={id}
      to={`/#${id}`}
      onClick={() => setOpen(false)}
      className={`text-sm transition-colors hover:text-white ${active === id ? 'text-accent' : 'text-zinc-400'}`}
    >
      {label}
    </Link>
  )

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled || open ? 'border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="font-mono text-sm font-semibold text-white">
          <span className="text-accent">~/</span>
          {profile.name.split(' ')[0].toLowerCase()}
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => navItem(l.id, l.label))}
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost py-1.5">
            Resume
          </a>
        </div>

        <button
          className="text-zinc-300 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="container-page flex flex-col gap-4 pb-6 md:hidden">
          {links.map((l) => navItem(l.id, l.label))}
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost w-fit py-1.5">
            Resume
          </a>
        </div>
      )}
    </header>
  )
}
