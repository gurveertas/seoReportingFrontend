import authBackground from '../assets/CountrySideJapanseseStreet.jpg'

export default function AuthVisual() {
  return (
    <aside
      aria-hidden="true"
      className="auth-visual min-h-screen bg-(--surface-muted) bg-[image:var(--auth-background)] bg-center bg-no-repeat bg-cover max-[700px]:hidden"
      style={{ '--auth-background': `url("${authBackground}")` }}
    />
  )
}

