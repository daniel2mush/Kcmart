import { useMemo } from 'react'
import { ArrowRight, FolderOpen, Tag } from 'lucide-react'
import Link from 'next/link'
import { ProductResponseTypes } from "@/lib/types/ProductTypes";
import Image from "next/image";

interface CardProps {
  title?: string
  viewMoreLink?: string
  iterable: ProductResponseTypes[]
  sliceValue?: number
}

export const Card = ({
  iterable,
  title,
  viewMoreLink,
  sliceValue,
}: CardProps) => {
  const displayItems = useMemo(
    () => (sliceValue ? iterable.slice(0, sliceValue) : iterable),
    [iterable, sliceValue],
  )

  return (
    <section className="w-full space-y-8 p-6 lg:p-10">
      {/* Section Header */}
      {title && (
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-linear-to-b from-primary to-primary/20" />
            <h2 className="text-2xl font-bold tracking-tight text-secondary lg:text-3xl">
              {title}
            </h2>
          </div>

          {viewMoreLink && (
            <Link
              href={viewMoreLink}
              className="group/view flex items-center gap-2 text-secondary/70 transition-colors duration-300 hover:text-primary"
            >
              <span className="text-sm font-medium hidden sm:inline">View All</span>
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden">
                <div className="absolute inset-0 scale-0 rounded-full bg-primary/10 transition-transform duration-300 group-hover/view:scale-150" />
                <ArrowRight
                  size={16}
                  className="relative transition-transform duration-300 group-hover/view:translate-x-1"
                />
              </div>
            </Link>
          )}
        </header>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((product, index) => {
          const primaryCategory = product.categories?.[0]?.name || 'Product'
          const categorySlug = primaryCategory.toLowerCase()
          const tags = product.tags?.slice(0, 3) || []
          const link = `/${categorySlug}/${product.slug}`
          const formattedPrice = (product.priceCent / 100).toFixed(2)

          return (
            // Fixed height on desktop (lg:h-80) allows the absolute content to slide up over the image
            <Link
              key={product.id || index}
              href={link}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-sm transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:h-80"
            >
              {/* Image Container */}
              <div className="relative h-56 lg:h-full w-full overflow-hidden bg-inset">
                <Image
                  src={product.images?.[0]?.url || '/placeholder-product.webp'}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10">
                    <FolderOpen size={12} />
                    {primaryCategory}
                  </span>
                </div>
              </div>

              {/* Content Container (Slides up on desktop hover) */}
              <div
                className="
                  relative z-20 flex flex-col gap-4
                  border-t border-border/50 bg-surface/95 p-5 backdrop-blur-md
                  lg:absolute lg:inset-x-0 lg:bottom-0 lg:border-t-0
                  lg:translate-y-28 lg:group-hover:translate-y-0
                  lg:transition-transform lg:duration-500 lg:ease-out
                "
              >
                {/* Title & Price (Always visible, acts as the "peek" area on desktop) */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-secondary transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                  <span className="whitespace-nowrap text-lg font-bold text-primary">
                    ${formattedPrice}
                  </span>
                </div>

                {/* Tags (Hidden below the fold on desktop until hover) */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag.name}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/5 border border-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        <Tag size={10} />
                        {tag.name}
                      </span>
                    ))}
                    {(product.tags?.length || 0) > 3 && (
                      <span className="self-center text-xs text-muted">
                        +{(product.tags?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Button (Pushed to bottom of the sliding panel) */}
                <div className="flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-border px-4 py-3 text-sm font-medium text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5 mt-auto">
                  <span>View Product</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}