import { createFileRoute } from '@tanstack/react-router'
import DashboardHeader from '#/components/Dashboard/DashboardHeader.tsx'

export const Route = createFileRoute('/dashboard/folders/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <DashboardHeader />
    </div>
  )
}
