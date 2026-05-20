import ProductView from '#/components/helpers/ProductView'
import { Magazines } from '#/lib/staticResources'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getIsAuthenticated } from '#/lib/authentication/authenticate.ts'

export const Route = createFileRoute('/magazines/$itemId')({
  component: RouteComponent,
  beforeLoad: async () => {
    const Authenticated = await getIsAuthenticated()
    if (Authenticated) throw redirect({ to: '/dashboard' })
  },
})

function RouteComponent() {
  const { itemId } = Route.useParams()

  const validProduct = Magazines.filter(
    (product) => product.id === Number(itemId),
  )

  return (
    <div>
      <ProductView validProduct={validProduct[0]} />
    </div>
  )
}
