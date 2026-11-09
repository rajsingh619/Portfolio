import { projects } from '../data/profile'
import Section from './Section'
import { FeaturedProjectCard, ProjectCard } from './ProjectCard'

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <Section id="projects" index="02" title="Projects">
      {featured.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((p) => (
            <FeaturedProjectCard key={p.title} p={p} />
          ))}
        </div>
      )}
      {others.length > 0 && (
        <>
          <h3 className="mb-6 mt-14 text-center font-semibold text-zinc-300">Other noteworthy projects</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </div>
        </>
      )}
    </Section>
  )
}
