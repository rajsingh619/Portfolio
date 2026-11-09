import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80">
      <div className="container-page py-8 text-center">
        <p className="font-mono text-xs text-zinc-500">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
