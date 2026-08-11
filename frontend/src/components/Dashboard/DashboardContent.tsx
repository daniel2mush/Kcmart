import { Input } from '#/components/ui/input.tsx'
import { BellDot, MessageCircle, Search } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { Card } from '#/components/helpers/Card'
import React, { useEffect, useMemo } from 'react'
import {
  Mockups,
  Templates,
  Graphics,
  Magazines,
} from '#/lib/staticResources.ts'
import type { ProductResponseTypes } from '#/lib/types/ProductTypes.ts'
import { useQuery } from '@apollo/client/react'
import { GET_All_PUBLISHED_PRODUCTS } from '#/lib/query/product.ts'
import { useNavigate, useSearch } from '@tanstack/react-router'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '#/components/ui/pagination.tsx'

const DashboardContent = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { page, limit, category } = useSearch({
    from: '/dashboard',
  })

  const navigate = useNavigate()

  const { data: query_data, loading } = useQuery(GET_All_PUBLISHED_PRODUCTS, {
    variables: {
      // Backend pagination is intentionally not used for
      // the catalog pagination. We fetch the DB products
      // and paginate after mixing them with static products.
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
   *
   * This only runs when the database data changes,
   * so changing page/category does not reshuffle
   * the products.
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
   *
   * No category means "All".
   */
  const filteredProducts = useMemo(() => {
    if (!category || category.toLowerCase() === 'all') {
      return products
    }

    const normalizedCategory = category.toLowerCase()

    return products.filter((product) => {
      return product.categories.some(
        (item) => item.name.toLowerCase() === normalizedCategory,
      )
    })
  }, [products, category])

  /**
   * Total pages AFTER filtering.
   */
  const totalPages = Math.ceil(filteredProducts.length / limit)

  /**
   * If filtering leaves us on a page that no longer exists,
   * go back to page 1.
   *
   * Example:
   *
   * All products:
   * page 5
   *
   * Select Templates:
   * only 2 pages
   *
   * Automatically goes to page 1.
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
   * Calculate current page.
   *
   * Filtering happens BEFORE this.
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
   * Change category.
   *
   * Whenever category changes, reset to page 1.
   *
   * "all" removes the category parameter completely.
   */
  // const handleCategoryChange = (value: string) => {
  //   navigate({
  //     to: '/dashboard',
  //     search: (prev) => ({
  //       ...prev,
  //       page: 1,
  //       category: value === 'all' ? undefined : value,
  //     }),
  //   })
  // }

  /**
   * Pagination numbers.
   *
   * Example:
   *
   * 1 2 3 4 5
   *
   * or:
   *
   * 1 ... 4 5 6 ... 20
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
    <div className="max-h-screen min-h-screen w-full overflow-x-scroll">
      {/* Search / notifications */}
      <div className="flex w-full items-center justify-between border-b-2 px-14 py-4">
        <div className="flex w-xl items-center justify-between rounded-2xl border px-4 py-1">
          <Input
            placeholder="Search product..."
            className="border-none! bg-transparent! shadow-none outline-0! ring-0! focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <Button size="icon-lg" variant="ghost" className="cursor-pointer">
            <Search size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-10">
          <BellDot
            size={25}
            className="cursor-pointer text-secondary hover:text-gray-400"
          />

          <MessageCircle
            size={25}
            className="cursor-pointer text-secondary hover:text-gray-400"
          />
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div>Loading...</div>
      ) : filteredProducts.length > 0 ? (
        <div>
          <Card iterable={currentProducts} />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8 pb-8">
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
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
                        href="#"
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
                    href="#"
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
