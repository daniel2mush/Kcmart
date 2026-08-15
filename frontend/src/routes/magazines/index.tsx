import { Card } from '#/components/helpers/Card'
import HeaderHelper from '#/components/helpers/HeaderHelper'
import { Magazines } from '#/lib/staticResources'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/magazines/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <HeaderHelper />
      <div className={'container'}>
        <Card iterable={Magazines} />
      </div>
    </div>
  )
}
