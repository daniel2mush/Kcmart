import ProductView from '#/components/helpers/ProductView'
import { Templates } from '#/lib/staticResources'
import { createFileRoute } from '@tanstack/react-router'
import type { ProductResponseTypes } from '#/lib/types/ProductTypes.ts'
import { useQuery } from '@apollo/client/react'
import { GET_PRODUCT_WITH_SLUG } from '#/lib/query/product.ts'
import { Loader } from 'lucide-react'

export const Route = createFileRoute('/templates/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()

  const { data, loading, error } = useQuery(GET_PRODUCT_WITH_SLUG, {
    variables: { slug },
  })
  if (loading) {
    return (
      <div className={' h-screen w-screen flex items-center justify-center'}>
        <Loader />
      </div>
    )
  }
  const validData = data as { productWithSlug: ProductResponseTypes }

  // 1. Fallback lookup with array safety check
  const staticProduct = Array.isArray(Templates)
    ? Templates.find((item) => item.slug === slug)
    : null

  // 2. Resolve final product
  const validProduct = error ? staticProduct : validData.productWithSlug

  // 3. Guard against invalid items (prevents ProductView runtime crash)
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
      <ProductView product={validProduct} />
    </div>
  )
}
