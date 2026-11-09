import { motion, type Variants } from 'framer-motion'
import { Award, Repeat } from 'lucide-react'
import { certifications, skills, workingStyle } from '../data/profile'
import { groupMeta, skillMeta } from '../lib/skillIcons'
import Section from './Section'

const chipIn: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 20 } },
}

function SkillChip({ name }: { name: string }) {
  const { icon: Icon, color } = skillMeta(name)
  return (
    <motion.li
      variants={chipIn}
      whileHover={{ y: -2, scale: 1.04, borderColor: color, boxShadow: `0 0 18px ${color}40` }}
      className="flex cursor-default items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 text-sm text-zinc-200"
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color }} aria-hidden="true" />
      {name}
    </motion.li>
  )
}

function SkillGroup({ title, items, index }: { title: string; items: string[]; index: number }) {
  const { icon: Icon, color } = groupMeta(title)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition-colors duration-300 hover:border-zinc-700"
    >
      {/* colour aura that fades in on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: color }}
      />

      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: index * 0.1 + 0.1 }}
            className="flex h-11 w-11 items-center justify-center rounded-lg border"
            style={{ color, borderColor: `${color}55`, background: `${color}14` }}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </motion.div>
          <h3 className="font-semibold text-white">{title}</h3>
          <span className="ml-auto font-mono text-xs text-zinc-600">{items.length} skills</span>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            show: { transition: { delayChildren: index * 0.1 + 0.3, staggerChildren: 0.06 } },
          }}
          className="flex flex-wrap gap-2"
        >
          {items.map((s) => (
            <SkillChip key={s} name={s} />
          ))}
        </motion.ul>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <Section id="skills" index="03" title="Skills">
      <div className="grid gap-5 md:grid-cols-2">
        {Object.entries(skills).map(([group, items], i) => (
          <SkillGroup key={group} title={group} items={items} index={i} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-center gap-2 text-sm text-zinc-500"
      >
        <Repeat className="h-4 w-4 text-accent" aria-hidden="true" />
        Ways of working: <span className="text-zinc-300">{workingStyle.join(', ')}</span>
      </motion.p>

      {certifications.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500">
            <Award className="h-4 w-4 text-accent" aria-hidden="true" /> Certifications & achievements
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {certifications.map((c) => (
              <li key={c.title} className="card p-5">
                <p className="font-medium text-white">{c.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{c.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
