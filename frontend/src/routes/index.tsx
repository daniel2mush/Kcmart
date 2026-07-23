import Graphics from '#/components/Graphics'
import Hero from '#/components/Hero'
import Latest from '#/components/Latest'
import Magazine from '#/components/Magazine'
import NewsLetter from '#/components/NewsLetter'
import Promo2 from '#/components/Promo2'
import Template from '#/components/Template'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
  beforeLoad: async () => {
    // const Authenticated = await getIsAuthenticated()
    // if (Authenticated) throw redirect({ to: '/dashboard' })
  },
})

function Home() {
  return (
    <div className="relative">
      <Hero />
      <Latest />
      <Promo2 />
      <Template />
      <Graphics />
      <Magazine />
      <NewsLetter />
    </div>
  )
}
