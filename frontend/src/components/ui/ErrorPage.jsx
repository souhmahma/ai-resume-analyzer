import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

const errors = {
  404: {
    code   : '404',
    emoji  : '🚀',
    title  : 'Lost in space',
    message: "This page drifted off into the void. Let's get you back home.",
    color  : 'from-blue-500 to-purple-500',
    particles: 'bg-blue-500/20',
    hint   : 'The page you\'re looking for doesn\'t exist or has been moved.',
  },
  403: {
    code   : '403',
    emoji  : '🛡️',
    title  : 'Access denied',
    message: "You don't have permission to enter this zone.",
    color  : 'from-orange-500 to-red-500',
    particles: 'bg-orange-500/20',
    hint   : 'You need to be logged in or have the right permissions.',
  },
  500: {
    code   : '500',
    emoji  : '🔥',
    title  : 'Server on fire',
    message: "Something exploded on our end. We're putting it out!",
    color  : 'from-red-500 to-pink-500',
    particles: 'bg-red-500/20',
    hint   : 'This is on us, not you. Try again in a few seconds.',
  },
  429: {
    code   : '429',
    emoji  : '⏱️',
    title  : 'Slow down!',
    message: "You're going too fast. Take a breath and try again.",
    color  : 'from-yellow-500 to-orange-500',
    particles: 'bg-yellow-500/20',
    hint   : 'You\'ve made too many requests. Wait a moment before trying again.',
  },
}

// Floating particle
function Particle({ color, delay, x, y, size }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{
        y      : [0, -40, 0],
        opacity: [0, 0.6, 0],
        scale  : [1, 1.3, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat  : Infinity,
        delay,
        ease    : 'easeInOut',
      }}
    />
  )
}

export default function ErrorPage({ type = 404 }) {
  const navigate = useNavigate()
  const error    = errors[type] || errors[404]

  const particles = Array.from({ length: 25 }, (_, i) => ({
    x   : Math.random() * 100,
    y   : Math.random() * 100,
    size: `${4 + Math.random() * 8}px`,
    delay: Math.random() * 3,
  }))

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <Particle key={i} color={error.particles} {...p} />
        ))}
      </div>

      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className={`absolute w-96 h-96 rounded-full blur-3xl bg-gradient-to-r ${error.color} opacity-10`}
      />

      <div className="text-center z-10 max-w-md">

        {/* Animated emoji */}
        <motion.div
          animate={{
            y     : [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl mb-6 select-none"
        >
          {error.emoji}
        </motion.div>

        {/* Error code */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-9xl font-black bg-gradient-to-r ${error.color} bg-clip-text text-transparent mb-2 leading-none`}
        >
          {error.code}
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white mb-3"
        >
          {error.title}
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 mb-2"
        >
          {error.message}
        </motion.p>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/25 text-sm mb-8 px-4"
        >
          {error.hint}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 justify-center flex-wrap"
        >
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Go back
          </Button>
          <Button onClick={() => navigate('/')}>
            🏠 Go home
          </Button>
          {type === 500 && (
            <Button variant="ghost" onClick={() => window.location.reload()}>
              🔄 Try again
            </Button>
          )}
        </motion.div>

        {/* Error code hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/15 text-xs mt-8 font-mono"
        >
          Error {error.code} · ResumeAI
        </motion.p>
      </div>
    </div>
  )
}