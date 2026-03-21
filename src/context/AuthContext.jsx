import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange, fetchAppUser, signInWithEmail, signOutUser } from '../firebase/services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [appUser, setAppUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await fetchAppUser(firebaseUser.uid)
          setCurrentUser(firebaseUser)
          setAppUser(profile)
        } catch {
          setCurrentUser(firebaseUser)
          setAppUser(null)
        }
      } else {
        setCurrentUser(null)
        setAppUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = (email, password) => signInWithEmail(email, password)
  const logout = () => signOutUser()

  return (
    <AuthContext.Provider value={{ currentUser, appUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
