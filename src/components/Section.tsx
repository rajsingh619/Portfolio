import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  id: string
  index?: string // e.g. "01"
  title: string
  children: ReactNode
  action?: ReactNode
}

export default function Section({ id, index, title, children, action }: Props) {
  return (
    <section id={id} className="container-page py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="flex items-baseline gap-3 text-2xl font-semibold text-white sm:text-3xl">
            {index && <span className="font-mono text-base text-accent">{index}.</span>}
            {title}
          </h2>
          {action}
        </div>
        {children}
      </motion.div>
    </section>
  )
}
