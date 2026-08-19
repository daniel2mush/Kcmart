'use client'

import React, { useEffect, useMemo, useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { BellDot, MessageCircle, Search, X } from 'lucide-react'
import { useQuery } from '@apollo/client/react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/helpers/Card'
import { GET_All_PUBLISHED_PRODUCTS } from '@/lib/query/product'
import { ProductResponseTypes } from '@/lib/types/ProductTypes'
import { Graphics, Magazines, Mockups, Templates } from '@/lib/staticResources'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

// Next.js requires Suspense when using useSearchParams
const DashboardContent = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContentInner />
    </Suspense>
  )
}

const DashboardContentInner = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read state from URL (Syncs with your Sidebar category clicks)
  const currentPage = Number(searchParams.get('page') || 1)
  const currentCategory = searchParams.get('category') || 'all'

  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const limit = 12 // Divisible by 2, 3, and 4 for perfect grids

  // Helper to update URL parameters without full page reloads
  const updateUrl = (params: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      // Clean up the URL by removing default/empty values
      if (value === null || value === '' || value === 1 || value === 'all') {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })

    startTransition(() => {
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }

  const { data: query_data, loading } = useQuery(GET_All_PUBLISHED_PRODUCTS, {
    variables: { limit: 1000, page: 1 },
  })

  const dbProducts = (query_data as any)?.products || []

  // Combine database and static products, shuffle once
  const allProducts = useMemo(() => {
    const combined: ProductResponseTypes[] = [
      ...dbProducts,
      ...Templates,
      ...Mockups,
      ...Graphics,
      ...Magazines,
    ]

    // Fisher-Yates shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]]
    }
    return combined
  }, [dbProducts])

  // Filter by category AND search query
  const filteredProducts = useMemo(() => {
    let result = allProducts

    if (currentCategory !== 'all') {
      result = result.filter((product) =>
        product.categories?.some(
          (item) => item.name.toLowerCase() === currentCategory.toLowerCase()
        )
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.tags?.some((tag) => tag.name.toLowerCase().includes(query))
      )
    }

    return result
  }, [allProducts, currentCategory, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / limit))

  // Auto-reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateUrl({ page: 1 })
    }
  }, [currentPage, totalPages])

  const start = (currentPage - 1) * limit
  const currentProducts = filteredProducts.slice(start, start + limit)

  // Smart Pagination Logic (1 ... 4 5 6 ... 10)
  const paginationItems = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push('ellipsis')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }, [currentPage, totalPages])

  return (
    <div className="min-h-screen w-full min-w-0 bg-background">

      {/* Sticky Header with Search */}
      <header className="sticky top-0 z-30 flex w-full items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex min-w-0 flex-1 items-center rounded-xl border border-border bg-surface px-3 py-2 sm:max-w-md transition-colors focus-within:border-primary/50">
          <Search size={18} className="shrink-0 text-secondary" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (currentPage !== 1) updateUrl({ page: 1 }) // Reset to page 1 on search
            }}
            placeholder="Search products, tags..."
            className="border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-secondary"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-secondary hover:text-primary transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <Button variant="ghost" size="icon" className="relative text-secondary hover:text-primary">
            <BellDot size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="text-secondary hover:text-primary">
            <MessageCircle size={20} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <Card iterable={currentProducts} />

            {totalPages > 1 && (
              <Pagination className="mt-12 pb-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) updateUrl({ page: currentPage - 1 })
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {paginationItems.map((item, index) =>
                    item === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === item}
                          onClick={(e) => {
                            e.preventDefault()
                            updateUrl({ page: item })
                          }}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) updateUrl({ page: currentPage + 1 })
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={48} className="mb-4 text-secondary" />
            <h3 className="text-xl font-semibold text-secondary">No products found</h3>
            <p className="mt-2 text-secondary max-w-sm">
              Try adjusting your search or filter to find what you&#39;re looking for.
            </p>
            {searchQuery && (
              <Button variant="outline" className="mt-6" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// Skeleton fallback for Suspense
function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6">
      <Skeleton className="h-12 w-full max-w-md rounded-xl" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default DashboardContent