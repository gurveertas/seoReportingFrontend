export default function SectionHeading({ id, eyebrow, title }) {
  return (
    <header className="mb-4">
      <p className="mb-3 text-label font-bold tracking-eyebrow text-accent-text uppercase">{eyebrow}</p>
      <h2 className="font-heading text-section font-medium-bold tracking-tight" id={id}>{title}</h2>
    </header>
  )
}
