import { Link } from 'react-router-dom'
import notFoundBackground from '../assets/cat.jpg'

export default function NotFoundPage() {
  return (
    <main className="not-found-page [display:grid] [min-height:100vh] [min-height:100svh] [padding:24px] [place-items:center] [background-color:#111713] [background-image:linear-gradient(135deg,_#101914c7,_#10191469),_var(--not-found-background)] [background-position:center] [background-repeat:no-repeat] [background-size:cover] [color:#f3f6f3]" style={{ '--not-found-background': `url("${notFoundBackground}")` }} aria-labelledby="not-found-title">
      <section className="not-found-card [width:min(590px,_100%)] [padding:clamp(30px,_6vw,_54px)] [border:1px_solid_#ffffff42] [border-radius:22px] [background:#10191480] [box-shadow:0_24px_70px_#0005] [text-align:center] [backdrop-filter:blur(8px)] [&_h1]:[margin:0] [&_h1]:[font-family:'Manrope',_sans-serif] [&_h1]:[font-size:clamp(34px,_6vw,_54px)] [&_h1]:[font-weight:700] [&_h1]:[letter-spacing:-0.06em] [&_h1]:[line-height:1.08]">
        <p className="not-found-card__code [display:inline-flex] [margin:0_0_17px] [padding:7px_11px] [border:1px_solid_#ffffff40] [border-radius:20px] [color:#d3e2d6] [font-size:10px] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase]">404 · Page not found</p>
        <h1 id="not-found-title">Sorry, this page is missing.</h1>
        <p className="not-found-card__message [max-width:390px] [margin:15px_auto_25px] [color:#d2dbd4] [font-size:14px] [line-height:1.65]">
          The page may have moved, or the address might be mistyped.
        </p>
        <Link className="not-found-card__link [display:inline-flex] [min-height:44px] [align-items:center] [justify-content:center] [padding:0_17px] [border-radius:9px] [background:#f3f6f3] [color:#21372d] [font-size:12px] [font-weight:700] [text-decoration:none] [transition:background_150ms_ease,_transform_150ms_ease] [&:hover]:[transform:translateY(-1px)] [&:hover]:[background:#fff] [&:focus-visible]:[outline:3px_solid_#a6c794] [&:focus-visible]:[outline-offset:4px] motion-reduce:[transition:none]" to="/">
          Go to the home page
        </Link>
      </section>
    </main>
  )
}

