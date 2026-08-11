import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '#/components/Dashboard/dashboard.tsx'
import { requireAuth } from '#/lib/helpers/authentication/authenticate.ts'
import z from 'zod'

const dashboardSearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
  category: z.string().optional(),
})

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  validateSearch: dashboardSearchSchema,
  beforeLoad: async () => requireAuth(),
})
function RouteComponent() {
  return (
    <div>
      <Dashboard />
    </div>
  )
}
