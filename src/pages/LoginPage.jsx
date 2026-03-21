import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bus, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/image/F_logo_for_login.jpg'

function mapFirebaseError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] || 'Login failed. Please try again.'
}

export default function LoginPage() {
  const { login, appUser, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && appUser?.role === 'admin' && !appUser?.isArchived) {
      navigate('/admin', { replace: true })
    }
  }, [appUser, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      // AuthContext will update appUser → useEffect will redirect
    } catch (err) {
      setError(mapFirebaseError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDE3] to-orange-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Card header — orange gradient */}
          <div className="bg-gradient-to-r from-[#F98C1F] to-[#F57C00] px-8 py-8 text-center">
            <div className="flex justify-center mb-3">
              <img
                src={logoImg}
                alt="SmartKids Shuttle"
                className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg"
              />
            </div>
            <h1 className="text-white font-extrabold text-2xl">SmartKids Shuttle</h1>
            <p className="text-white/80 text-sm mt-1">Admin Portal</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-xl font-bold text-[#222222] mb-6">Sign in to continue</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F] focus:border-transparent transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#666666]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F98C1F] hover:bg-[#F57C00] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Bus size={16} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-sm text-[#666666]">
          <Link to="/" className="hover:text-[#F98C1F] transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  )
}
