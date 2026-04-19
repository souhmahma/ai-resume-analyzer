import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-production-d759.up.railway.app/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error

    if (response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/token/refresh/`,
            { refresh }
          )
          localStorage.setItem('access_token', data.access)
          error.config.headers.Authorization = `Bearer ${data.access}`
          return api(error.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }

    const errorData = response?.data
    if (errorData?.error) {
      toast.error(errorData.message || 'Something went wrong', {
        style: {
          background: '#1e1e2e',
          color      : '#fff',
          border     : '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
        },
        iconTheme: {
          primary  : '#ef4444',
          secondary: '#fff',
        },
      })
    }

    return Promise.reject(error)
  }
)

export default api
