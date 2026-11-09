import type { ElementType } from 'react'
import { Code2, Database, Globe, Layers, Monitor, RefreshCw, Rocket, Server } from 'lucide-react'
import { FaDatabase, FaJava } from 'react-icons/fa'
import {
  SiCss,
  SiDocker,
  SiGithubactions,
  SiHibernate,
  SiHtml5,
  SiJavascript,
  SiJenkins,
  SiMysql,
  SiPostgresql,
  SiReact,
  SiSpring,
  SiSpringboot,
  SiTailwindcss,
} from 'react-icons/si'

export type Meta = { icon: ElementType; color: string }

// Brand colours, lightened where the official colour is too dark for a dark background
const SKILLS: Record<string, Meta> = {
  'React.js': { icon: SiReact, color: '#61DAFB' },
  'JavaScript (ES6+)': { icon: SiJavascript, color: '#F7DF1E' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#38BDF8' },
  HTML: { icon: SiHtml5, color: '#E34F26' },
  CSS: { icon: SiCss, color: '#3D9BE9' },

  Java: { icon: FaJava, color: '#F89820' },
  'Spring Boot': { icon: SiSpringboot, color: '#6DB33F' },
  'Spring MVC': { icon: SiSpring, color: '#6DB33F' },
  'Spring Data JPA': { icon: SiSpring, color: '#6DB33F' },
  Hibernate: { icon: SiHibernate, color: '#A7B3BD' },
  'RESTful APIs': { icon: Globe, color: '#38BDF8' },
  Microservices: { icon: Layers, color: '#A78BFA' },

  SQL: { icon: FaDatabase, color: '#94A3B8' },
  MySQL: { icon: SiMysql, color: '#4FA0D8' },
  PostgreSQL: { icon: SiPostgresql, color: '#5B8DEF' },

  Docker: { icon: SiDocker, color: '#2496ED' },
  'GitHub Actions': { icon: SiGithubactions, color: '#4D8DFF' },
  Jenkins: { icon: SiJenkins, color: '#E0654F' },
  'CI/CD': { icon: RefreshCw, color: '#34D399' },
}

const GROUPS: Record<string, Meta> = {
  Frontend: { icon: Monitor, color: '#61DAFB' },
  Backend: { icon: Server, color: '#6DB33F' },
  Databases: { icon: Database, color: '#5B8DEF' },
  'Deployment & DevOps': { icon: Rocket, color: '#2496ED' },
}

const FALLBACK: Meta = { icon: Code2, color: '#A1A1AA' }

export const skillMeta = (name: string): Meta => SKILLS[name] ?? FALLBACK
export const groupMeta = (name: string): Meta => GROUPS[name] ?? FALLBACK
