import { Input } from '#/components/ui/input.tsx'
import { BellDot, MessageCircle, Search } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { useGetAllProducts } from '#/components/queries/products/ProductQuery'
import { Card } from '#/components/helpers/Card'
import { useState } from 'react'
import {
  Mockups,
  Templates,
  Graphics,
  Magazines,
} from '#/lib/staticResources.ts'
import type { ProductResponseTypes } from '#/lib/types/ProductTypes.ts'

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

  const { data, isLoading } = useGetAllProducts()
  const [products] = useState(() => {
    const combined = [
      ...(data || []),
      ...Templates,
      ...Mockups,
      ...Graphics,
      ...Magazines,
    ]
    return { data: shuffleArray(combined) }
  })

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
      {isLoading ? (
        <div>Loading...</div>
      ) : data && data.length > 0 ? (
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
