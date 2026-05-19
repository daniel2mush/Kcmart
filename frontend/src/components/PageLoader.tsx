import { Boxes, PackageSearch, ShoppingBag } from 'lucide-react'

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-app px-6 text-center">
      <div className="mb-10 grid size-28 place-items-center border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
        <div className="relative grid size-16 place-items-center">
          <span className="absolute inset-0 animate-spin border border-primary/40" />
          <span className="absolute inset-2 border border-muted/40" />
          <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 animate-pulse bg-primary" />
          <PackageSearch className="relative size-8 text-primary" strokeWidth={1.7} />
        </div>
      </div>
      <div className="mb-6 flex items-center gap-4 text-muted">
        <ShoppingBag className="size-5" strokeWidth={1.8} />
        <span className="h-px w-16 bg-border" />
        <Boxes className="size-5" strokeWidth={1.8} />
      </div>
      <p className="max-w-4xl text-4xl font-black leading-tight text-primary">
        Finding quality stock items for your next order.
      </p>
      <p className="mt-5 max-w-xl text-base font-medium leading-7 text-muted">
        Checking inventory, images, and product details.
      </p>
    </div>
  )
}

export default PageLoader
