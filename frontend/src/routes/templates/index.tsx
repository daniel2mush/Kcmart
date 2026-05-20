import { Card } from '#/components/helpers/Card'
import HeaderHelper from '#/components/helpers/HeaderHelper'
import { Templates } from '#/lib/staticResources'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getIsAuthenticated } from '#/lib/authentication/authenticate.ts'

export const Route = createFileRoute('/templates/')({
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
      <Card iterable={Templates} />
    </div>
  )
}
