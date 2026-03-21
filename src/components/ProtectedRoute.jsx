import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, appUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5EDE3]">
        <div className="w-8 h-8 border-4 border-[#F98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isAdmin = appUser?.role === 'admin' && appUser?.isArchived !== true
  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}
