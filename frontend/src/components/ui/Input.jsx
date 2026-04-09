import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Input({
  label,
  type     = 'text',
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <Icon size={16} />
          </div>
        )}
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`
            w-full bg-white/5 border rounded-xl px-4 py-3 text-white
            placeholder-white/30 transition-all duration-200
            focus:outline-none focus:ring-1
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-white/10 focus:border-brand-500 focus:ring-brand-500/20'
            }
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1.5 text-sm text-red-400"
          >
            <AlertCircle size={14} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}