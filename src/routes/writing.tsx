import { createFileRoute } from '@tanstack/react-router'
import BottomNav from '#/components/BottomNav'
import writings from '#/data/writings.json'

export const Route = createFileRoute('/writing')({
  component: Writing,
})

function Writing() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 ">
      <div className="space-y-8 mb-15">
        {writings.map((w) => (
          <a
            key={w.title}
            href={w.link}
            target="_blank"
            rel="noreferrer"
            className="block text-center no-underline group"
          >
            <h2 className="text-white text-2xl font-black neon-text-hover">
              {w.title}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {w.publisher} — {w.edition}
            </p>
          </a>
        ))}
      </div>
      <BottomNav />
    </div>
  )
}
