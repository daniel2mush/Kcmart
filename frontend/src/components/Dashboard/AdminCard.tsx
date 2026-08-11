import { useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap/dist/gsap'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  FolderOpen,
  Loader,
  MoreHorizontal,
  Tag,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge.tsx'

import type { ProductResponseTypes } from '#/lib/types/ProductTypes.ts'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '#/components/ui/dropdown-menu'
import {
  deleteStorageFiles,
  getStoragePath,
} from '#/lib/helpers/productHelper.ts'
import {
  DELETE_PRODUCT,
  GET_USER_PRODUCTS,
  PUBLISH_PRODUCT,
} from '#/lib/query/product.ts'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client/react'

interface CardProps {
  title?: string
  viewMoreLink?: string
  iterable: ProductResponseTypes[]
  sliceValue?: number
  getProductSlug?: (slug: string) => void
}

const AdminCard = ({
  iterable,
  title,
  viewMoreLink,
  sliceValue,
  getProductSlug,
}: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  /* ---------------------------------------------------------------------------------*/

  const [delete_product] = useMutation(DELETE_PRODUCT)
  const [isDeleting, setIsDeleting] = useState(false)

  const displayItems = useMemo(
    () => (sliceValue ? iterable.slice(0, sliceValue) : iterable),
    [iterable, sliceValue],
  )

  const [publish_product] = useMutation(PUBLISH_PRODUCT)

  const [isPublishing, setIsPublishing] = useState(false)
  const [productid, setProductId] = useState<string | null>(null)
  /* ---------------------------------------------------------------------------------*/

  async function handleDelete(
    slug: string,
    image_urls: string[],
    asset_url: string,
  ) {
    setIsDeleting(true)
    try {
      const imagePaths = image_urls.map(getStoragePath)

      const assetPath = getStoragePath(asset_url)

      await deleteStorageFiles([...imagePaths, assetPath])

      await delete_product({
        variables: {
          slug,
        },
        refetchQueries: [
          {
            query: GET_USER_PRODUCTS,
            variables: {
              page: 1,
              limit: 10,
            },
          },
        ],
      })

      setIsDeleting(false)
      setProductId(null)
      toast.success('Product deleted')
    } catch (error) {
      console.error(error)

      toast.error('Failed to delete product')
      setIsDeleting(false)
      setProductId(null)
    }
  }

  /* ---------------------------------------------------------------------------------*/

  async function handlePublish(slug: string) {
    setIsPublishing(true)
    const { error } = await publish_product({
      variables: {
        slug: slug,
      },
      refetchQueries: [
        {
          query: GET_USER_PRODUCTS,
          variables: {
            page: 1,
            limit: 10,
          },
        },
      ],
    })
    if (!error) {
      setIsPublishing(false)
      setProductId(null)

      toast.success('Product published')
      return
    }
    console.log(error)
    toast.error(error.message)
    setIsPublishing(false)
    setProductId(null)
  }

  /**
   * Container entrance animation
   */
  /* ---------------------------------------------------------------------------------*/

  useGSAP(
    () => {
      if (!containerRef.current) return

      gsap.to(containerRef.current, {
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      })
    },
    { scope: containerRef },
  )

  /**
   * Cards stagger animation
   */
  /* ---------------------------------------------------------------------------------*/

  useGSAP(
    () => {
      if (!containerRef.current || displayItems.length === 0) return

      const cards = gsap.utils.toArray('.card-item', containerRef.current)

      gsap.killTweensOf(cards)

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power3.out',
        },
      )
    },
    {
      dependencies: [displayItems],
      scope: containerRef,
    },
  )

  /* ---------------------------------------------------------------------------------*/

  return (
    <section
      ref={containerRef}
      style={{ transform: 'translateY(100px)' }}
      className="w-full space-y-8 p-8 lg:p-10"
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {title && (
            <>
              <div className="h-8 w-1 rounded-full bg-linear-to-b from-primary to-primary/20" />

              <h2 className="text-3xl font-bold tracking-tight text-secondary lg:text-4xl">
                {title}
              </h2>
            </>
          )}
        </div>

        {viewMoreLink && (
          <Link
            to={viewMoreLink}
            className="group/view flex items-center gap-2 text-secondary/70 transition-colors duration-300 hover:text-secondary"
          >
            <span className="text-sm font-medium">View All</span>

            <div className="relative">
              <div className="absolute inset-0 scale-0 rounded-full bg-primary/20 transition-transform duration-300 group-hover/view:scale-150" />

              <ArrowRight
                size={16}
                className="relative transition-transform duration-300 group-hover/view:translate-x-1"
              />
            </div>
          </Link>
        )}
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((product, index) => {
          const category = product.categories.map((c) => c.name)
          const tags = product.tags.slice(0, 3)

          const link = `/${category[0].toLowerCase()}/${product.slug}`

          return (
            <article
              key={product.id || index}
              style={{
                opacity: 0,
                transform: 'translateY(30px)',
              }}
              className="
                card-item
                group
                relative
                h-85
                overflow-hidden
                rounded-2xl
                border border-border/50
                bg-surface
                shadow-sm
                transition-all duration-500
                hover:border-primary/20
                hover:shadow-2xl
              "
            >
              {/* Gradient Overlay */}
              <div
                className="
                  pointer-events-none
                  absolute inset-0 z-10
                  bg-linear-to-t
                  from-black/80
                  via-black/30
                  to-transparent
                  opacity-0
                  transition-opacity duration-500
                  group-hover:opacity-100
                "
              />

              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.images![0].url}
                  alt={product.name}
                  loading="lazy"
                  className="
                    h-full w-full object-cover
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full
                      bg-black/50
                      px-3 py-1.5
                      text-xs font-medium text-white
                      backproduct-blur-md
                    "
                  >
                    <FolderOpen size={12} />
                    {category}
                  </span>
                </div>

                {/* Top Right Actions */}
                <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
                  {/* Status */}
                  <Badge
                    className={
                      product.status === 'PUBLISHED'
                        ? 'border-none bg-green-600 text-white'
                        : product.status === 'DRAFT'
                          ? 'border-none bg-yellow-700 text-white'
                          : 'border-none bg-red-600 text-white'
                    }
                  >
                    {product.status}
                  </Badge>

                  {/* Menu */}
                  <DropdownMenu
                    onOpenChange={(isOpen) => {
                      setProductId(isOpen ? product.id : null)
                    }}
                    open={product.id === productid}
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label="Open product menu"
                        className="
                          flex h-9 w-9 items-center justify-center
                          rounded-xl
                          border border-white/10
                          bg-black/40
                          text-white/80
                          shadow-lg
                          backproduct-blur-xl
                          transition-all duration-300
                          hover:scale-105
                          hover:bg-black/60
                          hover:text-white
                        "
                      >
                        <MoreHorizontal size={18} strokeWidth={2.2} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      sideOffset={10}
                      className="
                        w-48
                        rounded-2xl
                        border border-border/50
                        bg-surface/95
                        p-2
                        shadow-2xl
                        backproduct-blur-2xl
                      "
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          if (getProductSlug) {
                            getProductSlug(product.slug)
                          }
                        }}
                        className="cursor-pointer rounded-xl px-3 py-2.5"
                      >
                        Edit
                      </DropdownMenuItem>

                      {product.status != 'PUBLISHED' && (
                        <DropdownMenuItem
                          disabled={isPublishing}
                          onSelect={(e) => e.preventDefault()}
                          className={`cursor-pointer rounded-xl px-3 py-2.5 text-green-600!`}
                          onClick={() => handlePublish(product.slug)}
                        >
                          {isPublishing ? (
                            <div
                              className={
                                'w-full h-full flex justify-center items-center'
                              }
                            >
                              <Loader />
                            </div>
                          ) : (
                            'Publish'
                          )}
                        </DropdownMenuItem>
                      )}

                      <div className="my-1 h-px bg-border/50" />

                      <DropdownMenuItem
                        disabled={isDeleting}
                        onSelect={(e) => e.preventDefault()}
                        onClick={() =>
                          handleDelete(
                            product.slug,
                            product.images!.map((d) => d.url),
                            product.asset!.url,
                          )
                        }
                        className="
                          cursor-pointer
                          rounded-xl
                          px-3 py-2.5
                          text-red-500!
                          focus:text-red-500!
                        "
                      >
                        {isDeleting ? (
                          <div
                            className={
                              'w-full h-full flex justify-center items-center'
                            }
                          >
                            <Loader />
                          </div>
                        ) : (
                          'Delete'
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content */}
              <div
                className="
                  absolute bottom-0 left-0 right-0 z-20
                  border-t border-border/50
                  bg-surface/95
                  p-5
                  backproduct-blur-md
                  translate-y-20
                  transition-transform duration-500 ease-out
                  group-hover:translate-y-0
                "
              >
                <div className="space-y-4">
                  {/* Title + Price */}
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="
                        line-clamp-2
                        text-lg font-semibold
                        leading-tight text-secondary
                        transition-colors
                        group-hover:text-primary
                      "
                    >
                      {product.name}
                    </h3>

                    <span className="whitespace-nowrap text-lg font-bold text-primary">
                      ${(product.priceCent / 100).toFixed(2)}
                    </span>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag.name}
                          className="
                            inline-flex items-center gap-1
                            rounded-full
                            bg-primary/5
                            px-2.5 py-1
                            text-xs font-medium text-primary
                          "
                        >
                          <Tag size={10} />
                          {tag.name}
                        </span>
                      ))}

                      {product.tags.length > 3 && (
                        <span className="self-center text-xs text-muted">
                          +{product.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Action */}
                  <div
                    className="
                      pt-2
                      opacity-0
                      transition-opacity duration-700 delay-100
                      group-hover:opacity-100
                    "
                  >
                    <Link
                      to={link}
                      className="
                        group/btn
                        inline-flex w-full items-center justify-center gap-2
                        overflow-hidden
                        rounded-xl
                        border border-border
                        px-4 py-3
                        text-sm font-medium text-primary
                        transition-all duration-300
                        hover:border-primary/30
                        hover:bg-primary/5
                      "
                    >
                      <span className="relative z-10">View Product</span>

                      <ArrowRight
                        size={16}
                        className="
                          relative z-10
                          transition-transform
                          group-hover/btn:translate-x-1
                        "
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default AdminCard
