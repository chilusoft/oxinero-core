import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from '../api/client'
import type { Profile } from '../api/types'

type AuthContextValue = {
  profile: Profile | null | undefined
  setProfile: (p: Profile | null) => void
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null | undefined>(undefined)

  const refreshProfile = useCallback(async () => {
    await api.ensureCsrf()
    try {
      const data = await api.get<Profile>('/profile/')
      setProfileState(data)
    } catch {
      setProfileState(null)
    }
  }, [])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout/')
    } catch {
      /* ignore */
    } finally {
      setProfileState(null)
    }
  }, [])

  const setProfile = useCallback((p: Profile | null) => {
    setProfileState(p)
  }, [])

  return (
    <AuthContext.Provider value={{ profile, setProfile, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
