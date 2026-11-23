import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main aria-labelledby="not-found-title" className="grid min-h-svh place-items-center bg-night bg-not-found-photo bg-cover bg-center bg-no-repeat p-6 text-mist">
      <section className="w-full max-w-error-card rounded-3xl border border-white/26 bg-overlay/50 p-error-gutter text-center shadow-not-found backdrop-blur-sm">
        <p className="inline-flex mt-0 mb-4.5 mx-0 py-2 px-3 border border-white/25 rounded-2xl text-mist-label text-caption font-bold tracking-widest uppercase">404 · Page not found</p>
        <h1 className="m-0 font-heading text-error-title font-bold tracking-tighter leading-tight-display" id="not-found-title">Sorry, this page is missing.</h1>
        <p className="max-w-error-copy mt-4 mb-6.5 mx-auto text-mist-muted text-sm leading-relaxed">
          The page may have moved, or the address might be mistyped.
        </p>
        <Link className="inline-flex min-h-11 items-center justify-center py-0 px-4.5 rounded-lg bg-mist text-forest text-xs font-bold no-underline transition duration-150 hover:-translate-y-px hover:bg-white focus-visible:outline-3 focus-visible:outline-mist-focus focus-visible:outline-offset-4 motion-reduce:transition-none" to="/">
          Go to the home page
        </Link>
      </section>
    </main>
  )
}

