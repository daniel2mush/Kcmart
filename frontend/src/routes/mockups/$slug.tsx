import ProductView from '#/components/helpers/ProductView'
import { Mockups } from '#/lib/staticResources'
import { createFileRoute } from '@tanstack/react-router'
import type { ProductResponseTypes } from '#/lib/types/ProductTypes.ts'
import { useQuery } from '@apollo/client/react'
import { GET_PRODUCT_WITH_SLUG } from '#/lib/query/product.ts'
import { Loader } from 'lucide-react'

export const Route = createFileRoute('/mockups/$slug')({
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

  // console.log(validData.productWithSlug, 'Valid data')

  // 1. Fallback lookup with array guard
  const staticProduct = Array.isArray(Mockups)
    ? Mockups.find((item) => item.slug === slug)
    : null

  // 2. Resolve target product
  const validProduct = error ? staticProduct : validData.productWithSlug

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
      <ProductView product={validProduct} />
    </div>
  )
}
