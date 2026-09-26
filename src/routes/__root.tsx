import {
  createRootRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

const routeCamera: Record<string, { scale: number; origin: string }> = {
  '/': { scale: 1, origin: 'center center' },
  '/contact': { scale: 1.4, origin: '20% 50%' },
  '/writing': { scale: 1.4, origin: '80% 50%' },
}

function RootLayout() {
  const matchRoute = useMatchRoute()
  const isContact = !!matchRoute({ to: '/contact' })
  const isWriting = !!matchRoute({ to: '/writing' })

  const route = isContact ? '/contact' : isWriting ? '/writing' : '/'
  const { scale, origin } = routeCamera[route]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: "url('/bg.jpeg')",
          transform: `scale(${scale})`,
          transformOrigin: origin,
        }}
      />
      <div className="relative min-h-screen">
        <Link
          to="/"
          className="absolute top-0 left-0 z-10 text-white text-4xl font-black p-8 uppercase no-underline neon-text"
        >
          Kevin Zou
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
