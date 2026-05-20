import { Card } from '#/components/helpers/Card'
import HeaderHelper from '#/components/helpers/HeaderHelper'
import { Mockups } from '#/lib/staticResources'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getIsAuthenticated } from '#/lib/authentication/authenticate.ts'

export const Route = createFileRoute('/mockups/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const Authenticated = await getIsAuthenticated()
    if (Authenticated) throw redirect({ to: '/dashboard' })
  },
})

function RouteComponent() {
  return (
    <div>
      <HeaderHelper />
      <Card iterable={Mockups} />
    </div>
  )
}
