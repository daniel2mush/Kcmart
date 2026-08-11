import type { ProductResponseTypes } from '#/lib/types/ProductTypes'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '../ui/button'
import { Graphics, Magazines, Mockups, Templates } from '#/lib/staticResources'
import { Card } from './Card'
import { getIsAuthenticated } from '#/lib/helpers/authentication/authenticate.ts'
import { useEffect, useState } from 'react'

const ProductView = ({ product }: { product: ProductResponseTypes }) => {
  const [loggedIn, setLoggedIn] = useState(false)

  async function CheckAuth() {
    const response = await getIsAuthenticated()
    setLoggedIn(!!response)
  }

  useEffect(() => {
    CheckAuth()
  }, [loggedIn])

  function GetProductCategory(params: string) {
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
        return ''
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

  const productCategory = GetProductCategory(derivedType)
  const link = loggedIn ? '/dashboard' : `/${derivedType.toLowerCase()}`
  return (
    <div className=" max-w-500 min-h-screen flex justify-center items-center mx-auto">
      {/* This is where the grid starts */}
      <div className=" mt-20 p-20">
        <div className=" relative grid grid-cols-1 md:grid-cols-2 w-full gap-15">
          <div>
            <div className="">
              {product.images!.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-auto mb-4 rounded"
                />
              ))}
            </div>
          </div>

          <div className=" md:sticky md:top-30 self-start space-y-8">
            <Link
              to={link}
              className="flex items-center gap-2 mb-4 text-sm text-muted"
            >
              <ArrowLeft /> {loggedIn ? 'Dashboard' : derivedType}
            </Link>
            <h1 className=" text-3xl font-bold md:text-6xl text-secondary">
              {product.name}
            </h1>
            <p className=" space-x-4 text-sm text-muted">
              {product.categories.map((cat, i) => (
                <span key={i} className=" bg-muted/10 px-3 py-2 rounded-lg">
                  {cat.name}
                </span>
              ))}

              {product.tags.map((tag, i) => (
                <span key={i} className=" bg-muted/10 px-3 py-2 rounded-lg">
                  {tag.name}
                </span>
              ))}
            </p>

            <p className=" text-secondary">{product.description}</p>

            <div>
              <h3 className=" font-bold text-secondary text-xl">
                What's Included
              </h3>

              {
                <ul className="list-disc pl-5 space-y-2 mt-10">
                  {product.included.map((item, index) => (
                    <li key={index} className="text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              }
            </div>
            {/* Button for buy now  */}
            <Button className=" w-full text-app cursor-pointer">
              <ShoppingBag />
              Buy Now <b>${(product.priceCent / 100).toFixed(2)}</b>
            </Button>
          </div>
        </div>
        {/* More products suggestions  */}

        <div>
          <h2 className=" text-secondary font-bold text-2xl mt-20 mb-10">
            You might also like some {derivedType}
          </h2>
          <Card
            iterable={productCategory as ProductResponseTypes[]}
            sliceValue={6}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductView
