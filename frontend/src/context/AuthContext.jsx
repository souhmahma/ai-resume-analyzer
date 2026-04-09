import { createContext, useState, useEffect, useContext } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api.get('/auth/me/')
        .then(({ data }) => setUser(data))
        .catch(() => localStorage.clear())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login/', { username: email, password })
    localStorage.setItem('access_token',  data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const me = await api.get('/auth/me/')
    setUser(me.data)
    toast.success(`Welcome back, ${me.data.first_name || me.data.username}! 👋`, {
      style: {
        background  : '#1e1e2e',
        color       : '#fff',
        border      : '1px solid rgba(99,102,241,0.3)',
        borderRadius: '12px',
      },
    })
    return me.data
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    toast.success('Logged out successfully')
  }

  const register = async (data) => {
    await api.post('/auth/register/', data)
    toast.success('Account created! Please log in.')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)