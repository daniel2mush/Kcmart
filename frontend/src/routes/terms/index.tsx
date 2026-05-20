import HeaderHelper from '#/components/helpers/HeaderHelper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      {' '}
      <HeaderHelper />
    </div>
  )
}
