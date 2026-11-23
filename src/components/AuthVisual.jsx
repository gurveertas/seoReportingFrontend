import authBackground from '../assets/CountrySideJapanseseStreet.jpg'

export default function AuthVisual() {
  return (
    <aside
      aria-hidden="true"
      className="min-h-screen bg-surface-muted bg-auth-photo bg-center bg-no-repeat bg-cover max-auth-stack:none"
      style={{ '--auth-background': `url("${authBackground}")` }}
    />
  )
}

