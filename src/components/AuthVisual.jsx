import authBackground from '../assets/CountrySideJapanseseStreet.jpg'

export default function AuthVisual() {
  return (
    <aside
      aria-hidden="true"
      className="auth-visual [min-height:100vh] [background-color:var(--surface-muted)] bg-[image:var(--auth-background)] [background-position:center] [background-repeat:no-repeat] [background-size:cover] max-[700px]:[display:none]"
      style={{ '--auth-background': `url("${authBackground}")` }}
    />
  )
}

