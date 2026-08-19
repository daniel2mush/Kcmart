'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { Loader2 } from 'lucide-react'

import ProductView from '@/components/helpers/ProductView'
import { GET_PRODUCT_WITH_SLUG } from '@/lib/query/product'
// Fixed: Import the actual data array, NOT a page component
import {Mockups} from '@/lib/staticResources'
import type { ProductResponseTypes } from '@/lib/types/ProductTypes'

export default function MockupDetails() {
  // In Client Components, use useParams() instead of async params
  const params = useParams<{ slug: string }>()
  const slug = params.slug


  const { data, loading } = useQuery(GET_PRODUCT_WITH_SLUG, {
    variables: { slug },
    skip: !slug, // Prevents query from firing if slug is undefined
  })

  // 1. Safely find static fallback (Changed to Mockups since this is MockupDetails)
  const staticProduct = Mockups?.find((item) => item.slug === slug) || null



  // 2. Resolve final product (Database first, fallback to static)
const dbProduct = data as {productWithSlug : ProductResponseTypes | undefined}
  const validProduct = dbProduct?.productWithSlug || staticProduct

  // 3. Loading State (Using min-h-[60vh] so it doesn't break your layout if a Navbar exists)
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

          console.log(validProduct, 'Params')

  // 4. Not Found State
  if (!validProduct) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold text-secondary">Product Not Found</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          The requested Mockup could not be found. It may have been removed or the link is incorrect.
        </p>
      </div>
    )
  }

  return <ProductView product={validProduct} />
}