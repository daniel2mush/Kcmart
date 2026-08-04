import { Card } from '#/components/helpers/Card'
import HeaderHelper from '#/components/helpers/HeaderHelper'
import { Magazines } from '#/lib/staticResources'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getIsAuthenticated } from '#/lib/helpers/authentication/authenticate.ts'

export const Route = createFileRoute('/magazines/')({
  component: RouteComponent,
  beforeLoad: async () => {
    // const Authenticated = await getIsAuthenticated()
    // if (Authenticated) throw redirect({ to: '/dashboard' })
  },
})

function RouteComponent() {
  return (
    <div>
      <HeaderHelper />
      <Card iterable={Magazines} />
    </div>
  )
}
