import { motion } from 'framer-motion'

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  onClick,
  type     = 'button',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25',
    ghost  : 'border border-white/20 hover:border-white/40 text-white/80 hover:text-white',
    danger : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
    success: 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  )
}