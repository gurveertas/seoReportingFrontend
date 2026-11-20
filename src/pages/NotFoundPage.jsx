import { Link } from 'react-router-dom'
import notFoundBackground from '../assets/cat.jpg'

export default function NotFoundPage() {
  return (
    <main className="not-found-page grid min-h-screen min-h-svh p-6 place-items-center bg-[#111713] bg-[image:linear-gradient(135deg,_#101914c7,_#10191469),_var(--not-found-background)] bg-center bg-no-repeat bg-cover text-[#f3f6f3]" style={{ '--not-found-background': `url("${notFoundBackground}")` }} aria-labelledby="not-found-title">
      <section className="not-found-card w-[min(590px,100%)] p-[clamp(30px,6vw,54px)] border border-[#ffffff42] rounded-[22px] bg-[#10191480] shadow-[0_24px_70px_#0005] text-center backdrop-blur-[8px]">
        <p className="not-found-card__code inline-flex pt-0 pb-4.25 px-0 py-1.75 px-2.75 border border-[#ffffff40] rounded-[20px] text-[#d3e2d6] text-[10px] font-bold tracking-[0.1em] uppercase">404 · Page not found</p>
        <h1 className="m-0 font-manrope text-[clamp(34px,6vw,54px)] font-bold tracking-[-0.06em] leading-[1.08]" id="not-found-title">Sorry, this page is missing.</h1>
        <p className="not-found-card__message max-w-[390px] mx-auto mt-3.75 mb-[25px] text-[#d2dbd4] text-sm leading-[1.65]">
          The page may have moved, or the address might be mistyped.
        </p>
        <Link className="not-found-card__link inline-flex min-h-11 items-center justify-center px-4.25 rounded-[9px] bg-[#f3f6f3] text-[#21372d] text-xs font-bold no-underline transition-[background,transform] hover:-translate-y-px hover:bg-white focus-visible:outline-3 focus-visible:outline-[#a6c794] focus-visible:outline-offset-4 motion-reduce:transition-none" to="/">
          Go to the home page
        </Link>
      </section>
    </main>
  )
}

