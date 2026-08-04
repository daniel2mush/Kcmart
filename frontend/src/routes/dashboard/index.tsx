import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '#/components/Dashboard/dashboard.tsx'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})
function RouteComponent() {
  return (
    <div>
      <Dashboard />
    </div>
  )
}
