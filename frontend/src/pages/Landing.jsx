import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Brain, Upload, BarChart3, MessageSquare, ArrowRight, Star, Zap, Shield, CheckCircle } from 'lucide-react'

// Floating particle
function Particle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full bg-brand-500/20"
      style={style}
      animate={{
        y      : [0, -30, 0],
        opacity: [0.2, 0.8, 0.2],
        scale  : [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat  : Infinity,
        ease    : 'easeInOut',
        delay   : Math.random() * 2,
      }}
    />
  )
}

// Typewriter effect
function TypeWriter({ words }) {
  const [index, setIndex] = useState(0)
  const [text, setText]   = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word    = words[index]
    const timeout = deleting
      ? setTimeout(() => {
          setText(t => t.slice(0, -1))
          if (text.length === 1) {
            setDeleting(false)
            setIndex(i => (i + 1) % words.length)
          }
        }, 50)
      : setTimeout(() => {
          setText(word.slice(0, text.length + 1))
          if (text === word) {
            setTimeout(() => setDeleting(true), 3000)
          }
        }, 100)
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words])

  return (
    <span className="gradient-text">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-brand-400"
      >|</motion.span>
    </span>
  )
}

// Step card
function StepCard({ step, title, description, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-hover p-6 relative group"
    >
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {step}
      </div>
      <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/30 transition">
        <Icon size={22} className="text-brand-400" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

// Feature card
function FeatureCard({ icon: Icon, title, description, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="glass-hover p-6 group"
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

// Stat card
function StatCard({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <p className="text-4xl font-black gradient-text mb-1">{value}</p>
      <p className="text-white/40 text-sm">{label}</p>
    </motion.div>
  )
}

import { useState, useEffect } from 'react'

export default function Landing() {
  const heroRef        = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroOpacity    = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroY          = useTransform(scrollYProgress, [0, 0.5], [0, -100])

  const particles = Array.from({ length: 30 }, (_, i) => ({
    width : `${4 + Math.random() * 8}px`,
    height: `${4 + Math.random() * 8}px`,
    left  : `${Math.random() * 100}%`,
    top   : `${Math.random() * 100}%`,
  }))

  const steps = [
    {
      step       : 1,
      icon       : Upload,
      title      : 'Upload your resume',
      description: 'Drag & drop your PDF or DOCX file. We support all major resume formats.',
    },
    {
      step       : 2,
      icon       : Brain,
      title      : 'AI analyzes it',
      description: 'Our Gemini-powered AI reads every line and evaluates content, structure, skills and more.',
    },
    {
      step       : 3,
      icon       : BarChart3,
      title      : 'Get your score',
      description: 'Receive a detailed score with radar chart, suggestions and keywords analysis.',
    },
    {
      step       : 4,
      icon       : MessageSquare,
      title      : 'Practice interviews',
      description: 'Get personalized interview questions and generate a custom cover letter.',
    },
  ]

  const features = [
    {
      icon       : Brain,
      color      : 'bg-brand-500',
      title      : 'AI-powered analysis',
      description: 'Google Gemini reads your resume like an expert HR consultant would.',
    },
    {
      icon       : BarChart3,
      color      : 'bg-accent-purple',
      title      : 'Detailed scoring',
      description: '6 dimensions scored: content, structure, skills, experience, and more.',
    },
    {
      icon       : MessageSquare,
      color      : 'bg-accent-pink',
      title      : 'Interview prep',
      description: 'Get realistic interview questions tailored to your experience.',
    },
    {
      icon       : Zap,
      color      : 'bg-accent-cyan',
      title      : 'Instant results',
      description: 'Analysis complete in under 30 seconds. No waiting, no delays.',
    },
    {
      icon       : Shield,
      color      : 'bg-green-500',
      title      : 'Private & secure',
      description: 'Your data is encrypted and never shared with third parties.',
    },
    {
      icon       : Star,
      color      : 'bg-yellow-500',
      title      : 'Cover letter AI',
      description: 'Generate a personalized cover letter for any company in seconds.',
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex items-center justify-center px-4 pt-20"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((style, i) => (
            <Particle key={i} style={style} />
          ))}
          {/* Gradient orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-400 mb-8 border border-brand-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Brain size={14} />
            </motion.div>
            Powered by Google Gemini AI
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Get your resume
            <br />
            <TypeWriter words={['analyzed', 'optimized', 'perfected', 'scored']} />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your CV and get an AI-powered analysis with actionable suggestions,
            a compatibility score, and personalized interview preparation.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-lg flex items-center gap-2 shadow-lg shadow-brand-500/30 transition animate-glow"
              >
                Analyze my resume free
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-white/20 hover:border-white/40 text-white/80 hover:text-white rounded-xl font-semibold text-lg transition"
              >
                Sign in
              </motion.button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-8 text-white/30 text-sm"
          >
            <div className="flex -space-x-2">
              {['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500'].map((c, i) => (
                <div key={i} className={`w-7 h-7 ${c} rounded-full border-2 border-dark-300`} />
              ))}
            </div>
            <span>Join 2,000+ professionals already using ResumeAI</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* ── STATS ── */}
      <section className="py-16 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value="2K+"  label="Resumes analyzed"     delay={0} />
          <StatCard value="94%"  label="User satisfaction"    delay={0.1} />
          <StatCard value="30s"  label="Average analysis time" delay={0.2} />
          <StatCard value="Free" label="To get started"        delay={0.3} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-400 text-sm font-medium mb-3">HOW IT WORKS</p>
            <h2 className="text-4xl font-bold text-white mb-4">
              From upload to insights in <span className="gradient-text">4 steps</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Our AI-powered platform makes resume optimization simple and effective.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <StepCard key={i} {...step} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-400 text-sm font-medium mb-3">FEATURES</p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to <span className="gradient-text">land the job</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORE PREVIEW ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-purple/5 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-brand-400 text-sm font-medium mb-3">SAMPLE ANALYSIS</p>
                <h2 className="text-3xl font-bold text-white mb-4">
                  See what you'll get
                </h2>
                <ul className="space-y-3">
                  {[
                    'Overall score with 5 sub-scores',
                    'Actionable suggestions by priority',
                    'Keywords found & missing',
                    'Skills automatically detected',
                    'Personalized cover letter',
                    '10 interview questions',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-white/70 text-sm"
                    >
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <Link to="/register" className="inline-block mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center gap-2"
                  >
                    Try it free <ArrowRight size={16} />
                  </motion.button>
                </Link>
              </div>

              {/* Fake score preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between glass p-4 rounded-xl">
                  <span className="text-white/60 text-sm">Overall Score</span>
                  <span className="text-3xl font-black gradient-text">87%</span>
                </div>
                {[
                  { label: 'Content',    score: 90, color: 'bg-green-500' },
                  { label: 'Structure',  score: 85, color: 'bg-blue-500' },
                  { label: 'Skills',     score: 92, color: 'bg-purple-500' },
                  { label: 'Experience', score: 80, color: 'bg-orange-500' },
                  { label: 'Language',   score: 88, color: 'bg-cyan-500' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="flex justify-between text-xs text-white/40">
                      <span>{item.label}</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black text-white mb-4">
              Ready to <span className="gradient-text">level up</span>?
            </h2>
            <p className="text-white/40 mb-8 text-lg">
              Join thousands of job seekers who improved their resume with AI.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xl shadow-2xl shadow-brand-500/30 transition animate-glow"
              >
                Analyze my resume — it's free ✨
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-accent-purple rounded-md flex items-center justify-center">
              <Brain size={12} className="text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium">ResumeAI</span>
          </div>
          <p className="text-white/20 text-sm">
            Built by Souhail HMAHMA · 2026
          </p>
          <div className="flex gap-6 text-white/30 text-sm">
            <Link to="/login"    className="hover:text-white/60 transition">Login</Link>
            <Link to="/register" className="hover:text-white/60 transition">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}