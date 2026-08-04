import DashboardContent from '#/components/Dashboard/DashboardContent.tsx'
import Sidebar from '#/components/Dashboard/Sidebar.tsx'

const Dashboard = () => {
  return (
    <div className={'flex justify-center items-center'}>
      <Sidebar />
      <DashboardContent />
    </div>
  )
}

export default Dashboard

// const Sidebar2 = () => {
//   return <div>''This is new''</div>
// }
