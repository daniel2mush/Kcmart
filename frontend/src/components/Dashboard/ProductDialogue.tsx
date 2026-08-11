import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '#/components/ui/dialog.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Plus } from 'lucide-react'
import { ProductForm } from '#/components/Dashboard/ProductForm.tsx'
import { useEffect, useState } from 'react'

interface AdminProductProps {
  productSlug?: string
  clearProductSlug: () => void
}

export function ProductDialogue({
  productSlug,
  clearProductSlug,
}: AdminProductProps) {
  const [dialogueOpen, setDialogueOpen] = useState<boolean>(false)
  // console.log(productSlug)

  useEffect(() => {
    if (productSlug) {
      setDialogueOpen(true)
    }
  }, [productSlug])

  return (
    <>
      <Dialog open={dialogueOpen} onOpenChange={setDialogueOpen}>
        <DialogTrigger asChild className={'fixed bottom-20 right-10'}>
          <Button
            onClick={() => {
              clearProductSlug()
              setDialogueOpen(true)
            }}
            variant={'ghost'}
            className={
              'bg-secondary text-bg border border-border rounded-full h-20 w-20 cursor-pointer hover:bg-secondary/80'
            }
          >
            <Plus size={40} className={'text-black font-bold size-1/2'} />
          </Button>
        </DialogTrigger>

        <DialogContent className={'max-h-[90vh] overflow-y-auto'}>
          <ProductForm
            setOpenDialogue={(value) => setDialogueOpen(value)}
            productSlug={productSlug}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
