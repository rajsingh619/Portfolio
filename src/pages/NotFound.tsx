import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-zinc-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8">
        Back home
      </Link>
    </div>
  )
}
