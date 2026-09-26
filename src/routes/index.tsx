import { useState, useMemo, useEffect } from 'react'
import { marked } from 'marked'

import { createFileRoute, useRouter } from '@tanstack/react-router'

import { allJobs, allEducations } from 'content-collections'
import BottomNav from '#/components/BottomNav'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get unique tags from all jobs
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allJobs.forEach((job) => {
      job.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  // Filter jobs based on selected tags
  const filteredJobs = useMemo(() => {
    if (selectedTags.length === 0) return allJobs
    return allJobs.filter((job) =>
      selectedTags.some((tag) => job.tags.includes(tag)),
    )
  }, [selectedTags])

  const [leaving, setLeaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    return router.subscribe('onBeforeNavigate', (event) => {
      if (event.toLocation.pathname !== '/') {
        setLeaving(true)
      }
    })
  }, [router])

  const visible = loaded && !leaving

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-15">
      <div className="relative w-full max-w-[250px] sm:max-w-[300px]">
        {!loaded && (
          <div className="aspect-square w-full animate-pulse bg-white/10 border-10 border-[#ef053b]/30" />
        )}
        <img
          src="/portrait.jpg"
          alt="Kevin Zou"
          onLoad={() => setLoaded(true)}
          className={`w-full drop-shadow-xl transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'} ${loaded ? '' : 'absolute inset-0'} border-10 border-[#ef053b] neon-border`}
        />
      </div>
      <div className="">
        <BottomNav />
      </div>
    </div>
  )
}
