import ProductView from '#/components/helpers/ProductView'
import { Mockups } from '#/lib/staticResources'
import { createFileRoute } from '@tanstack/react-router'
import { getProductWithSlug } from '#/lib/helpers/getProductWithSlug.ts'
import type { ProductResponseTypes } from '#/lib/types/ProductTypes.ts'

export const Route = createFileRoute('/mockups/$itemId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      return await getProductWithSlug({ data: { slug: params.itemId } })
    } catch {
      // Gracefully handle backend errors so static fallback can run
      return null
    }
  },
})

function RouteComponent() {
  const { itemId } = Route.useParams()
  const apiProduct = Route.useLoaderData()

  // 1. Fallback lookup with array guard
  const staticProduct = Array.isArray(Mockups)
    ? Mockups.find((item) => item.slug === itemId)
    : null

  // 2. Resolve target product
  const validProduct = apiProduct ?? staticProduct

  // 3. Prevent runtime crash if slug exists in neither backend nor static files
  if (!validProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-xl font-semibold">Product Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The requested product could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ProductView validProduct={validProduct as ProductResponseTypes} />
    </div>
  )
}
