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
  const prevIsIndex = useRef(isIndex)

  // Capture positions before render
  const prevPositions = new Map(positionsRef.current)
  const layoutChanged = prevIsIndex.current !== isIndex

  useLayoutEffect(() => {
    prevIsIndex.current = isIndex

    itemRefs.current.forEach((el, key) => {
      const newRect = el.getBoundingClientRect()
      positionsRef.current.set(key, newRect)

      if (!layoutChanged) return

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
      className={`flex ${isIndex ? 'flex-col' : 'flex-col sm:flex-row'} justify-center items-center`}
    >
      {navItems.map((item) => {
        const isActive = !!matchRoute({ to: item.to })
        return (
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
            className={`text-white text-lg border-white p-2 sm:p-3 font-black neon-text-hover ${isActive ? 'neon-text' : ''}`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
