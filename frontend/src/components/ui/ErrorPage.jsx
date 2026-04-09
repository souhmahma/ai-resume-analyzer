import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

const errors = {
  404: {
    code   : '404',
    emoji  : '🚀',
    title  : 'Lost in space',
    message: 'This page drifted off into the void. Let\'s get you back home.',
    color  : 'from-blue-500 to-purple-500',
  },
  403: {
    code   : '403',
    emoji  : '🛡️',
    title  : 'Access denied',
    message: 'You don\'t have permission to enter this zone.',
    color  : 'from-orange-500 to-red-500',
  },
  500: {
    code   : '500',
    emoji  : '🔥',
    title  : 'Server on fire',
    message: 'Something exploded on our end. We\'re putting it out!',
    color  : 'from-red-500 to-pink-500',
  },
  429: {
    code   : '429',
    emoji  : '⏱️',
    title  : 'Slow down!',
    message: 'You\'re going too fast. Take a breath and try again.',
    color  : 'from-yellow-500 to-orange-500',
  },
}

export default function ErrorPage({ type = 404 }) {
  const navigate = useNavigate()
  const error    = errors[type] || errors[404]

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-500/30"
            style={{
              left: `${Math.random() * 100}%`,
              top : `${Math.random() * 100}%`,
            }}
            animate={{
              y      : [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat  : Infinity,
              delay   : Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10">
        {/* Animated emoji */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl mb-6"
        >
          {error.emoji}
        </motion.div>

        {/* Error code */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-8xl font-black bg-gradient-to-r ${error.color} bg-clip-text text-transparent mb-4`}
        >
          {error.code}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white mb-3"
        >
          {error.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 mb-8 max-w-md mx-auto"
        >
          {error.message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-center"
        >
          <Button onClick={() => navigate(-1)} variant="ghost">
            ← Go back
          </Button>
          <Button onClick={() => navigate('/')}>
            🏠 Go home
          </Button>
        </motion.div>
      </div>
    </div>
  )
}