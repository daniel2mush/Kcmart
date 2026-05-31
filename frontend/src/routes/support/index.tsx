import HeaderHelper from '#/components/helpers/HeaderHelper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/support/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className={''}>
      <HeaderHelper />
    </div>
  )
}
