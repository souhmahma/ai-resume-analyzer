import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const user = await login(form.username, form.password)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.detail) {
        setErrors({ general: 'Invalid credentials. Please try again.' })
      } else {
        setErrors({ general: 'Login failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-4">
            <Brain size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your ResumeAI account</p>
        </div>

        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                ⚠️ {errors.general}
              </motion.div>
            )}

            <Input
              label="Username"
              name="username"
              icon={Mail}
              value={form.username}
              onChange={handleChange}
              placeholder="your@email.com"
              error={errors.username}
              autoComplete="username"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-3"
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 transition">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
