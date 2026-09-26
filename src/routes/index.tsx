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
  const router = useRouter()

  useEffect(() => {
    return router.subscribe('onBeforeNavigate', (event) => {
      if (event.toLocation.pathname !== '/') {
        setLeaving(true)
      }
    })
  }, [router])

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src="/portrait.jpg"
        alt="Kevin Zou"
        className={`w-full max-w-[300px] drop-shadow-xl transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'} border-10 border-[#ef053b] neon-border mb-15`}
      />
      <BottomNav />
    </div>
  )
}
