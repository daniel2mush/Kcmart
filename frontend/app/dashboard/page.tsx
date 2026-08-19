
import {requireAuth} from "@/lib/helpers/authentication/authenticate";
import Dashboard from "@/components/Dashboard/dashboard";

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div>
      <Dashboard user={user} />
    </div>
  )
}