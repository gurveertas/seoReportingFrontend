import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <main className="not-found-page" aria-labelledby="not-found-title">
      <section className="not-found-card">
        <p className="not-found-card__code">404 · Page not found</p>
        <h1 id="not-found-title">Sorry, this page is missing.</h1>
        <p className="not-found-card__message">
          The page may have moved, or the address might be mistyped.
        </p>
        <Link className="not-found-card__link" to="/">
          Go to the home page
        </Link>
      </section>
    </main>
  )
}
