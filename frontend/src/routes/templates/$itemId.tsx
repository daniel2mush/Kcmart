import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/templates/$itemId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { itemId } = Route.useParams()
  return <div>{itemId}</div>
}
