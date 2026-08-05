import { Input } from '#/components/ui/input.tsx'
import { BellDot, MessageCircle, Search } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { Card } from '#/components/helpers/Card'
import { useMemo } from 'react'
import {
  Mockups,
  Templates,
  Graphics,
  Magazines,
} from '#/lib/staticResources.ts'
import type { ProductResponseTypes } from '#/lib/types/ProductTypes.ts'
import { useQuery } from '@apollo/client/react'
import { GET_All_PUBLISHED_PRODUCTS } from '#/lib/query/product.ts'

const DashboardContent = () => {
  // This is called Fisher-Yates Shuffle (recommended for true randomness and large arrays)
  const shuffleArray = (array: ProductResponseTypes[]) => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const { data: query_data, loading } = useQuery(GET_All_PUBLISHED_PRODUCTS, {
    variables: {
      limit: 10,
      page: 1,
    },
  })

  const data = query_data as { products: ProductResponseTypes[] }

  const products = useMemo(() => {
    const combined = [
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ...(data ? data.products : []),
      ...Templates,
      ...Mockups,
      ...Graphics,
      ...Magazines,
    ]

    return {
      data: shuffleArray(combined),
    }
  }, [data])

  return (
    <div className={'max-h-screen min-h-screen overflow-x-scroll w-full'}>
      {/*  This would be the search, notification and messages */}
      <div
        className={
          'flex justify-between items-center w-full border-b-2 px-14 py-4'
        }
      >
        <div
          className={
            'flex justify-between items-center border rounded-2xl px-4 py-1 w-xl '
          }
        >
          <Input
            placeholder={'Search product...'}
            className="border-none! shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0! outline-0! bg-transparent!"
          />
          <Button
            size={'icon-lg'}
            variant={'ghost'}
            className={'cursor-pointer'}
          >
            <Search size={16} />
          </Button>
        </div>
        <div className={'flex items-center gap-10'}>
          <BellDot
            size={25}
            className={' cursor-pointer hover:text-gray-400 text-secondary'}
          />
          <MessageCircle
            size={25}
            className={' cursor-pointer hover:text-gray-400 text-secondary'}
          />
        </div>
      </div>
      {/* Grid views. */}
      {loading ? (
        <div>Loading...</div>
      ) : data.products.length > 0 ? (
        <div>
          <Card iterable={products.data} />
        </div>
      ) : (
        <div>No data found.</div>
      )}
    </div>
  )
}

export default DashboardContent
