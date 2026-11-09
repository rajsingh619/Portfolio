import { useEffect } from 'react'
import { profile } from '../data/profile'
import Hero from '../components/Hero'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import CodingActivity from '../components/CodingActivity'
import Contact from '../components/Contact'

export default function Home() {
  useEffect(() => {
    document.title = `${profile.name} — ${profile.title}`
  }, [])

  return (
    <>
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <CodingActivity />
      <Contact />
    </>
  )
}
