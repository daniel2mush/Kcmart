import DashboardHeader from '#/components/Dashboard/DashboardHeader.tsx'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty.tsx'
import { FileQuestion, Loader } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import AdminCard from '#/components/Dashboard/AdminCard.tsx'
import { useQuery } from '@apollo/client/react'
import { GET_USER_PRODUCTS } from '#/lib/query/product.ts'
import type { ProductResponseTypes } from '#/lib/types/ProductTypes.ts'
import { ProductDialogue } from '#/components/Dashboard/ProductDialogue.tsx'
import { useState } from 'react'

export function AdminProduct() {
  const { data, loading } = useQuery(GET_USER_PRODUCTS, {
    variables: {
      limit: 10,
      page: 1,
    },
  })

  const productData = data?.userProduct ?? []

  const [productSlug, setProductSlug] = useState<string | null>(null)

  return (
    <>
      <DashboardHeader />

      <div className="p-4 sm:p-6 lg:p-10">
        {loading && (
          <div className="mt-50 flex w-full items-center justify-center">
            <Loader />
          </div>
        )}

        {!loading && productData.length === 0 ? (
          <div>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileQuestion />
                </EmptyMedia>

                <EmptyTitle>No data</EmptyTitle>

                <EmptyDescription>
                  You haven&apos;t created any product yet. Get started by
                  creating your first product.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent>
                <Button className="cursor-pointer text-black">
                  Add product
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className="w-full">
            {!loading && productData.length > 0 && (
              <AdminCard
                iterable={productData}
                title="My products"
                getProductSlug={(slug) => {
                  setProductSlug(slug)
                }}
              />
            )}
          </div>
        )}

        <ProductDialogue
          productSlug={productSlug ? productSlug : undefined}
          clearProductSlug={() => setProductSlug(null)}
        />
      </div>
    </>
  )
}
