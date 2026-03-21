import { useState } from 'react'
import { Bus, Building2, Users, GraduationCap, Route, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAdmin } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { id: 'schools',  label: 'Schools',  icon: Building2 },
  { id: 'people',   label: 'People',   icon: Users },
  { id: 'students', label: 'Students', icon: GraduationCap },
  { id: 'fleet',    label: 'Fleet',    icon: Bus },
  { id: 'trips',    label: 'Trips',    icon: Route },
]

export default function AdminLayout({ activeTab, onTabChange, children }) {
  const { appUser, logout } = useAuth()
  const { schools, selectedSchoolId, setSelectedSchoolId } = useAdmin()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const activeSchools = schools.filter(s => !s.isArchived)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F98C1F] rounded-lg flex items-center justify-center flex-shrink-0">
            <Bus size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">SmartKids</p>
            <p className="text-[#F98C1F] font-bold text-sm leading-tight">Shuttle Admin</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const ItemIcon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-[#F98C1F] text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <ItemIcon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#F98C1F] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {appUser?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{appUser?.name || 'Admin'}</p>
            <p className="text-gray-400 text-xs truncate">{appUser?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-sm px-2 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#F7F7F7] overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#222222] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-[#222222] flex flex-col">
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-[#222222] hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Page title */}
            <h1 className="font-bold text-[#222222] text-lg capitalize">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* School selector */}
            <div className="relative">
              <select
                value={selectedSchoolId}
                onChange={e => setSelectedSchoolId(e.target.value)}
                className="appearance-none text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F98C1F] bg-white text-[#222222]"
              >
                <option value="all">All Schools</option>
                {activeSchools.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Mobile logout */}
            <button
              onClick={handleLogout}
              className="md:hidden p-1.5 text-gray-400 hover:text-[#222222] hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
