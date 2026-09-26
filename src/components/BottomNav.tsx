import { useRef, useLayoutEffect } from 'react'
import { Link, useMatchRoute } from '@tanstack/react-router'

const navItems = [
  { to: '/' as const, label: 'home' },
  { to: '/writing' as const, label: 'writing' },
  { to: '/contact' as const, label: 'contact' },
] as const

export default function BottomNav() {
  const matchRoute = useMatchRoute()
  const isIndex = !!matchRoute({ to: '/' })
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const positionsRef = useRef<Map<string, DOMRect>>(new Map())

  // Capture positions before render
  const prevPositions = new Map(positionsRef.current)

  useLayoutEffect(() => {
    itemRefs.current.forEach((el, key) => {
      const newRect = el.getBoundingClientRect()
      positionsRef.current.set(key, newRect)

      const oldRect = prevPositions.get(key)
      if (!oldRect) return

      const dx = oldRect.left - newRect.left
      const dy = oldRect.top - newRect.top

      if (dx === 0 && dy === 0) return

      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0, 0)' },
        ],
        {
          duration: 500,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        },
      )
    })
  })

  return (
    <nav
      className={`absolute top-3/4 left-1/2 -translate-x-1/2 flex ${isIndex ? 'flex-col' : 'flex-row'} justify-center items-center border-white p-5`}
    >
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          ref={(el: HTMLAnchorElement | null) => {
            if (el) {
              itemRefs.current.set(item.to, el)
            } else {
              itemRefs.current.delete(item.to)
            }
          }}
          className="text-white text-lg border-white p-3 font-black neon-text-hover"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
