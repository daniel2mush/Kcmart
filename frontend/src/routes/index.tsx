import Hero from '#/components/Hero'
import Latest from '#/components/Latest'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      <Hero />
      <Latest />
    </div>
  )
}
