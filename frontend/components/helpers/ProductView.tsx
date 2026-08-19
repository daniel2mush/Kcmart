import type { ProductResponseTypes } from '@/lib/types/ProductTypes'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '../ui/button'
import { Graphics, Magazines, Mockups, Templates } from '@/lib/staticResources'
import { Card } from './Card'
import { useEffect, useState } from 'react'
import {getIsAuthenticated} from "@/lib/helpers/authentication/authenticate";
import Link from 'next/link'
import Image from "next/image";

const ProductView = ({ product }: { product: ProductResponseTypes }) => {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const response = await getIsAuthenticated()
      setLoggedIn(!!response)
    }

    checkAuth()
  }, [])

  function getProductCategory(params: string) {
    switch (params) {
      case 'Templates':
        return Templates
      case 'Mockups':
        return Mockups
      case 'Graphics':
        return Graphics
      case 'Magazines':
        return Magazines
      default:
        return []
    }
  }

  const categories = product.categories.map((category) => category.name)

  const tags = product.tags.map((tag) => tag.name)

  let derivedType = 'Templates'

  if (categories.includes('MOCKUPS')) {
    derivedType = 'Mockups'
  } else if (categories.includes('TEMPLATE')) {
    derivedType = 'Templates'
  } else if (categories.includes('GRAPHICS')) {
    if (tags.includes('magazine')) {
      derivedType = 'Magazines'
    } else {
      derivedType = 'Graphics'
    }
  }

  const productCategory = getProductCategory(derivedType)

  const link = loggedIn ? '/dashboard' : `/${derivedType.toLowerCase()}`

  return (
    <main className="min-h-screen w-full">
      {/* Main product section */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)] lg:gap-16">
          {/* =========================
              Product Images
          ========================== */}


<div className="min-w-0 order-2 lg:order-1">
  <div className="space-y-4">
    {product.images?.map((image, index) => (
      <div
        key={index}
        className="w-full overflow-hidden rounded-2xl border border-border/50 bg-surface"
      >
        <Image
          src={image.url}
          alt={`${product.name} - Image ${index + 1}`}
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full object-cover"
          priority={index === 0} // Replaces loading="eager" for the first image
        />
      </div>
    ))}
  </div>
</div>
          {/* =========================
              Product Information
          ========================== */}
          <div className="min-w-0 order-1 lg:order-2 ">
            <div className="lg:sticky lg:top-24">
              <div className="space-y-7">
                {/* Back */}
                <Link
                  href={link}
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-secondary"
                >
                  <ArrowLeft size={17} />

                  <span>{loggedIn ? 'Dashboard' : derivedType}</span>
                </Link>

                {/* Title */}
                <div>
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                    {product.name}
                  </h1>
                </div>

                {/* Categories + Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category, index) => (
                    <span
                      key={`category-${index}`}
                      className="rounded-lg bg-muted/10 px-3 py-1.5 text-xs font-medium text-secondary"
                    >
                      {category.name}
                    </span>
                  ))}

                  {product.tags.map((tag, index) => (
                    <span
                      key={`tag-${index}`}
                      className="rounded-lg bg-muted/10 px-3 py-1.5 text-xs font-medium text-secondary"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <p className="text-base leading-7 text-secondary">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Included */}
                {product.included.length > 0 && (
                  <div className="border-t border-border/60 pt-7">
                    <h2 className="text-xl font-bold text-secondary">

                      What&#39;s Included
                    </h2>

                    <ul className="mt-5 space-y-3">
                      {product.included.map((item, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-secondary"
                        >
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price + Buy */}
                <div className="border-t border-border/60 pt-7">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="text-sm text-secondary">Price</span>

                    <span className="text-2xl font-bold text-secondary">
                      ${(product.priceCent / 100).toFixed(2)}
                    </span>
                  </div>

                  <Button className="h-12 w-full cursor-pointer text-app">
                    <ShoppingBag size={18} />

                    <span>Buy Now</span>

                    <span className="font-bold">
                      ${(product.priceCent / 100).toFixed(2)}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Related Products
      ========================== */}
      <section className="w-full border-t border-border/50">
        <div className="mx-auto w-full max-w-7xl">
          <div className=" px-10 py-10">
            <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
              You might also like
            </h2>

            <p className="mt-2 text-sm text-secondary">
              Explore more {derivedType.toLowerCase()}.
            </p>
          </div>

          <Card iterable={productCategory} sliceValue={6} />
        </div>
      </section>
    </main>
  )
}

export default ProductView
