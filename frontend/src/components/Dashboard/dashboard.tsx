import DashboardContent from '#/components/Dashboard/DashboardContent.tsx'
import Sidebar from '#/components/Dashboard/Sidebar.tsx'

const Dashboard = () => {
  return (
    <div className={'w-full min-h-screen'}>
      <div className={'flex  h-screen '}>
        <div className={'flex items-center'}>
          <Sidebar />
          <DashboardContent />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

// const Sidebar2 = () => {
//   return <div>''This is new''</div>
// }
