import { useState } from 'react'
import { AdminProvider } from '../context/AdminContext'
import AdminLayout from '../components/admin/AdminLayout'
import SchoolsTab from '../components/admin/SchoolsTab'
import PeopleTab from '../components/admin/PeopleTab'
import StudentsTab from '../components/admin/StudentsTab'
import FleetTab from '../components/admin/FleetTab'
import TripsTab from '../components/admin/TripsTab'

function AdminContent() {
  const [activeTab, setActiveTab] = useState('schools')

  const tabMap = {
    schools: <SchoolsTab />,
    people: <PeopleTab />,
    students: <StudentsTab />,
    fleet: <FleetTab />,
    trips: <TripsTab />,
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {tabMap[activeTab]}
    </AdminLayout>
  )
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  )
}
