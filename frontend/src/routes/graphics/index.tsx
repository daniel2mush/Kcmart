import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/graphics/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/graphics"!</div>
}
