import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, User, Mail, Lock, Briefcase } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]     = useState({
    first_name: '', last_name: '', username: '',
    email: '', password: '', password2: ''
  })
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

    if (form.password !== form.password2) {
      setErrors({ password2: 'Passwords do not match.' })
      setLoading(false)
      return
    }

    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        setErrors(data)
      } else {
        setErrors({ general: 'Registration failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent-pink/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-4">
            <Brain size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/40 text-sm mt-1">Free forever · No credit card required</p>
        </div>

        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {errors.general && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                ⚠️ {errors.general}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                name="first_name"
                icon={User}
                value={form.first_name}
                onChange={handleChange}
                placeholder="John"
                error={errors.first_name?.[0]}
              />
              <Input
                label="Last name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Doe"
                error={errors.last_name?.[0]}
              />
            </div>

            <Input
              label="Username"
              name="username"
              icon={User}
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
              error={errors.username?.[0]}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              error={errors.email?.[0]}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={form.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              error={errors.password?.[0]}
            />

            <Input
              label="Confirm password"
              name="password2"
              type="password"
              icon={Lock}
              value={form.password2}
              onChange={handleChange}
              placeholder="Repeat password"
              error={errors.password2}
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-3"
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 transition">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}