import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ProductForm } from '@/components/Dashboard/ProductForm'

interface AdminProductProps {
  productSlug?: string
  clearProductSlug: () => void
}

export function ProductDialogue({
  productSlug,
  clearProductSlug,
}: AdminProductProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Automatically open dialog when a product slug is passed (Edit Mode)
  useEffect(() => {
    if (productSlug) {
      setIsOpen(true)
    }
  }, [productSlug])

  // Centralized open/close handler
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      clearProductSlug()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>

      {/* Applied classes and props directly to DialogTrigger (No asChild needed) */}
      <DialogTrigger
        onClick={() => clearProductSlug()}
        aria-label="Add new product"
        className="fixed bottom-10 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer"
      >
        <Plus size={28} strokeWidth={2.5} />
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] lg:max-w-[800px]">
        <ProductForm
          setOpenDialogue={setIsOpen}
          productSlug={productSlug}
          clearProductSlug={clearProductSlug}
        />
      </DialogContent>
    </Dialog>
  )
}