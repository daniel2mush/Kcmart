'use client'
import { Input } from '@/components/ui/input'
import { BellDot, MessageCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/helpers/Card'
import React, { useEffect, useMemo } from 'react'
import {useRouter} from "next/navigation";
import {GET_All_PUBLISHED_PRODUCTS} from "@/lib/query/product";
import {ProductResponseTypes} from "@/lib/types/ProductTypes";



const DashboardContent = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { page, limit, category } = useSearch({
    from: '/dashboard',
  })

  const navigate = useRouter()

  const { data: query_data, loading } = useQuery(GET_All_PUBLISHED_PRODUCTS, {
    variables: {
      limit: 1000,
      page: 1,
    },
  })

  const data = query_data as { products: ProductResponseTypes[] } | undefined

  /**
   * Fisher-Yates shuffle.
   */
  const shuffleArray = (array: ProductResponseTypes[]) => {
    const arr = [...array]

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }

    return arr
  }

  /**
   * Combine database products and static products.
   */
  const products = useMemo(() => {
    const combined: ProductResponseTypes[] = [
      ...(data?.products ?? []),
      ...Templates,
      ...Mockups,
      ...Graphics,
      ...Magazines,
    ]

    return shuffleArray(combined)
  }, [data])

  /**
   * Filter products by category.
   */
  const filteredProducts = useMemo(() => {
    if (!category || category.toLowerCase() === 'all') {
      return products
    }

    const normalizedCategory = category.toLowerCase()

    return products.filter((product) =>
      product.categories.some(
        (item) => item.name.toLowerCase() === normalizedCategory,
      ),
    )
  }, [products, category])

  /**
   * Total pages after filtering.
   */
  const totalPages = Math.ceil(filteredProducts.length / limit)

  /**
   * Keep page valid after filtering.
   */
  useEffect(() => {
    if (totalPages === 0) {
      if (page !== 1) {
        navigate({
          to: '/dashboard',
          search: (prev) => ({
            ...prev,
            page: 1,
          }),
          replace: true,
        })
      }

      return
    }

    if (page > totalPages) {
      navigate({
        to: '/dashboard',
        search: (prev) => ({
          ...prev,
          page: 1,
        }),
        replace: true,
      })
    }
  }, [page, totalPages, navigate])

  /**
   * Current page.
   */
  const start = (page - 1) * limit
  const end = start + limit

  const currentProducts = filteredProducts.slice(start, end)

  /**
   * Change page.
   */
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return
    }

    navigate({
      to: '/dashboard',
      search: (prev) => ({
        ...prev,
        page: pageNumber,
      }),
    })
  }

  /**
   * Previous page.
   */
  const handlePrevious = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (page <= 1) {
      return
    }

    navigate({
      to: '/dashboard',
      search: (prev) => ({
        ...prev,
        page: page - 1,
      }),
    })
  }

  /**
   * Next page.
   */
  const handleNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (page >= totalPages) {
      return
    }

    navigate({
      to: '/dashboard',
      search: (prev) => ({
        ...prev,
        page: page + 1,
      }),
    })
  }

  /**
   * Pagination numbers.
   */
  const paginationItems = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }

      return pages
    }

    pages.push(1)

    if (page > 4) {
      pages.push('ellipsis')
    }

    const startPage = Math.max(2, page - 1)

    const endPage = Math.min(totalPages - 1, page + 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (page < totalPages - 3) {
      pages.push('ellipsis')
    }

    pages.push(totalPages)

    return pages
  }, [page, totalPages])

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden">
      {/* Search / notifications */}
      <header className="flex w-full items-center gap-4 border-b border-border px-4 py-4 sm:px-6 lg:px-10">
        {/* Search */}
        <div className="flex min-w-0 flex-1 items-center rounded-2xl border px-3 py-1 sm:max-w-xl">
          <Input
            placeholder="Search product..."
            className="min-w-0 border-none! bg-transparent! shadow-none outline-0! ring-0! focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <Button
            size="icon-lg"
            variant="ghost"
            className="shrink-0 cursor-pointer"
          >
            <Search size={16} />
          </Button>
        </div>

        {/* Notifications */}
        <div className="hidden shrink-0 items-center gap-6 sm:flex lg:gap-10">
          <BellDot
            size={25}
            className="cursor-pointer text-secondary hover:text-gray-400"
          />

          <MessageCircle
            size={25}
            className="cursor-pointer text-secondary hover:text-gray-400"
          />
        </div>
      </header>

      {/* Products */}
      {loading ? (
        <div className="flex min-h-60 items-center justify-center">
          Loading...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="min-w-0">
          <Card iterable={currentProducts} />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8 overflow-x-auto pb-8">
              <PaginationContent className="mx-auto flex-nowrap">
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href="@ "
                    onClick={handlePrevious}
                    aria-disabled={page === 1}
                    className={
                      page === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {/* Page numbers */}
                {paginationItems.map((item, index) => {
                  if (item === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="@ "
                        isActive={page === item}
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(item)
                        }}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    href="@ "
                    onClick={handleNext}
                    aria-disabled={page === totalPages}
                    className={
                      page === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      ) : (
        <div className="p-10 text-center">No products found.</div>
      )}
    </div>
  )
}

export default DashboardContent
