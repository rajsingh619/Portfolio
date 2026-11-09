import { useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import Section from './Section'
import { SocialLinks } from './Icons'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Section id="contact" index="05" title="Get in touch">
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <p className="text-lg text-zinc-300">
          I'm currently looking for new opportunities. Whether you have a role in mind, a question, or just want to
          say hi — my inbox is open.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${profile.email}`} className="btn-primary">
            <Mail className="h-4 w-4" /> Say hello
          </a>
          <button onClick={copy} className="btn-ghost font-mono">
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : profile.email}
          </button>
        </div>
        <SocialLinks socials={profile.socials} className="mt-8 justify-center" />
      </div>
    </Section>
  )
}
