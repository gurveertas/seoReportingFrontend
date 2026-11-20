import { Link } from 'react-router-dom'
import notFoundBackground from '../assets/cat.jpg'

export default function NotFoundPage() {
  return (
    <main className="not-found-page grid min-h-screen min-h-svh p-6 place-items-center bg-[#111713] bg-[image:linear-gradient(135deg,_#101914c7,_#10191469),_var(--not-found-background)] bg-center bg-no-repeat bg-cover text-[#f3f6f3]" style={{ '--not-found-background': `url("${notFoundBackground}")` }} aria-labelledby="not-found-title">
      <section className="not-found-card w-[min(590px,_100%)] pt-[clamp(30px,] pb-[54px)] px-[6vw,] border border-[#ffffff42] rounded-[22px] bg-[#10191480] shadow-[0_24px_70px_#0005] text-center backdrop-blur-[8px] [&_h1]:m-0 [&_h1]:font-manrope [&_h1]:text-[clamp(34px,_6vw,_54px)] [&_h1]:font-bold [&_h1]:tracking-[-0.06em] [&_h1]:leading-[1.08]">
        <p className="not-found-card__code inline-flex pt-0 pb-4.25 px-0 py-1.75 px-2.75 border border-[#ffffff40] rounded-[20px] text-[#d3e2d6] text-[10px] font-bold tracking-[0.1em] uppercase">404 · Page not found</p>
        <h1 id="not-found-title">Sorry, this page is missing.</h1>
        <p className="not-found-card__message max-w-[390px] pt-3.75 pb-[25px] px-auto text-[#d2dbd4] text-sm leading-[1.65]">
          The page may have moved, or the address might be mistyped.
        </p>
        <Link className="not-found-card__link inline-flex min-h-11 items-center justify-center py-0 px-4.25 rounded-[9px] bg-[#f3f6f3] text-[#21372d] text-xs font-bold no-underline transition-[background_150ms_ease,_transform_150ms_ease] [&:hover]:-translate-y-px [&:hover]:bg-[#fff] [&:focus-visible]:outline-3 outline-[#a6c794] [&:focus-visible]:outline-offset-[4px] motion-reduce:transition-none" to="/">
          Go to the home page
        </Link>
      </section>
    </main>
  )
}

