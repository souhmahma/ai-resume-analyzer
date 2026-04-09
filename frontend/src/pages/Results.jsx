import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip
} from 'recharts'
import {
  Brain, FileText, MessageSquare, ArrowLeft,
  CheckCircle, XCircle, AlertTriangle, Lightbulb,
  Download, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { getAnalysis, getResumeStatus } from '../api/resumes'
import Button from '../components/ui/Button'
import LoadingScreen from '../components/ui/LoadingScreen'

// Animated score counter
function AnimatedScore({ score, size = 'lg' }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps    = 60
    const increment = score / steps
    let current    = 0
    const timer    = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayed(score)
        clearInterval(timer)
      } else {
        setDisplayed(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [score])

  const color = score >= 85
    ? 'from-green-400 to-emerald-400'
    : score >= 70
    ? 'from-blue-400 to-cyan-400'
    : score >= 50
    ? 'from-yellow-400 to-orange-400'
    : 'from-red-400 to-pink-400'

  const sizeCls = size === 'lg' ? 'text-7xl' : 'text-3xl'

  return (
    <span className={`${sizeCls} font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
      {displayed}
    </span>
  )
}

// Score bar
function ScoreBar({ label, score, delay = 0 }) {
  const color = score >= 80
    ? 'bg-green-500'
    : score >= 60
    ? 'bg-blue-500'
    : score >= 40
    ? 'bg-yellow-500'
    : 'bg-red-500'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="text-white font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  )
}

// Suggestion card
function SuggestionCard({ suggestion, index }) {
  const [expanded, setExpanded] = useState(false)

  const priorityConfig = {
    high  : { color: 'border-red-500/30 bg-red-500/5',    badge: 'bg-red-500/20 text-red-400',    icon: '🔴' },
    medium: { color: 'border-yellow-500/30 bg-yellow-500/5', badge: 'bg-yellow-500/20 text-yellow-400', icon: '🟡' },
    low   : { color: 'border-green-500/30 bg-green-500/5',  badge: 'bg-green-500/20 text-green-400',  icon: '🟢' },
  }

  const config = priorityConfig[suggestion.priority] || priorityConfig.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-xl p-4 cursor-pointer ${config.color}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <span>{config.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>
                {suggestion.priority}
              </span>
              <span className="text-xs text-white/40">{suggestion.category}</span>
            </div>
            <p className="text-white text-sm">{suggestion.suggestion}</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-white/40 mt-1" /> : <ChevronDown size={16} className="text-white/40 mt-1" />}
      </div>

      <AnimatePresence>
        {expanded && suggestion.example && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pl-8"
          >
            <div className="bg-white/5 rounded-lg p-3 text-sm text-white/60 border border-white/5">
              <span className="text-brand-400 font-medium">Example: </span>
              {suggestion.example}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Results() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [polling, setPolling]   = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadAnalysis()
  }, [id])

  const loadAnalysis = async () => {
    try {
      const { data } = await getAnalysis(id)
      setAnalysis(data)
      setLoading(false)

      // Confetti for high scores
      if (data.overall_score >= 85) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread       : 70,
            origin       : { y: 0.6 },
            colors       : ['#6366f1', '#a855f7', '#ec4899'],
          })
        }, 2000)
      }
    } catch (err) {
      if (err.response?.status === 202) {
        // Still analyzing — poll
        setPolling(true)
        setLoading(false)
        pollStatus()
      } else {
        setLoading(false)
      }
    }
  }

  const pollStatus = () => {
    const interval = setInterval(async () => {
      try {
        const { data } = await getResumeStatus(id)
        if (data.status === 'done') {
          clearInterval(interval)
          setPolling(false)
          loadAnalysis()
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setPolling(false)
        }
      } catch {
        clearInterval(interval)
        setPolling(false)
      }
    }, 3000)
  }

  const radarData = analysis ? [
    { subject: 'Content',    score: analysis.content_score    },
    { subject: 'Structure',  score: analysis.structure_score  },
    { subject: 'Skills',     score: analysis.skills_score     },
    { subject: 'Experience', score: analysis.experience_score },
    { subject: 'Language',   score: analysis.language_score   },
  ] : []

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: Brain },
    { id: 'details',   label: 'Details',   icon: FileText },
    { id: 'interview', label: 'Interview', icon: MessageSquare },
  ]

  if (loading) return <LoadingScreen />

  if (polling) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-white mb-2">Analyzing your resume...</h2>
        <p className="text-white/40">This usually takes 10-30 seconds</p>
      </div>
    </div>
  )

  if (!analysis) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-semibold text-white mb-4">Analysis not found</h2>
        <Button onClick={() => navigate('/dashboard')}>← Back to dashboard</Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition text-sm"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </button>
        </motion.div>

        {/* Header — Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 mb-6 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-purple/5 pointer-events-none" />

          <p className="text-white/40 text-sm mb-2">{analysis.resume_filename}</p>

          <div className="flex items-center justify-center gap-4 mb-4">
            <AnimatedScore score={analysis.overall_score} />
            <div className="text-left">
              <p className="text-white/40 text-sm">Overall Score</p>
              <p className={`font-semibold text-lg
                ${analysis.overall_score >= 85 ? 'text-green-400'
                : analysis.overall_score >= 70 ? 'text-blue-400'
                : analysis.overall_score >= 50 ? 'text-yellow-400'
                : 'text-red-400'}`}>
                {analysis.score_label}
              </p>
            </div>
          </div>

          <p className="text-white/60 max-w-2xl mx-auto text-sm leading-relaxed">
            {analysis.summary}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeTab === tabId
                  ? 'bg-brand-500 text-white'
                  : 'glass text-white/60 hover:text-white'
                }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Radar Chart */}
              <div className="glass p-6">
                <h3 className="font-semibold text-white mb-4">Score breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                    />
                    <Tooltip
                      contentStyle={{
                        background   : '#1e1e2e',
                        border       : '1px solid rgba(255,255,255,0.1)',
                        borderRadius : '8px',
                        color        : '#fff',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Score bars */}
              <div className="glass p-6 space-y-4">
                <h3 className="font-semibold text-white mb-4">Section scores</h3>
                <ScoreBar label="Content"    score={analysis.content_score}    delay={0.1} />
                <ScoreBar label="Structure"  score={analysis.structure_score}  delay={0.2} />
                <ScoreBar label="Skills"     score={analysis.skills_score}     delay={0.3} />
                <ScoreBar label="Experience" score={analysis.experience_score} delay={0.4} />
                <ScoreBar label="Language"   score={analysis.language_score}   delay={0.5} />
              </div>

              {/* Strengths */}
              <div className="glass p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-400" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <span className="text-green-400 mt-0.5">✓</span>
                      {strength}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="glass p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <XCircle size={18} className="text-red-400" /> Areas to improve
                </h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <span className="text-red-400 mt-0.5">✗</span>
                      {weakness}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="glass p-6 md:col-span-2">
                <h3 className="font-semibold text-white mb-4">Skills detected</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills_detected.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1 bg-brand-500/20 text-brand-400 rounded-full text-sm border border-brand-500/20"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Suggestions */}
              <div className="glass p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb size={18} className="text-yellow-400" />
                  Actionable suggestions
                </h3>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, i) => (
                    <SuggestionCard key={i} suggestion={suggestion} index={i} />
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6">
                  <h3 className="font-semibold text-white mb-4 text-green-400">
                    ✅ Keywords found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords_found.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs border border-green-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="glass p-6">
                  <h3 className="font-semibold text-white mb-4 text-red-400">
                    ❌ Keywords missing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords_missing.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs border border-red-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <CoverLetterSection resumeId={id} initialCoverLetter={analysis.cover_letter} />
            </motion.div>
          )}

          {/* Interview Tab */}
          {activeTab === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InterviewSection resumeId={id} initialQuestions={analysis.interview_questions} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// Cover Letter Section
function CoverLetterSection({ resumeId, initialCoverLetter }) {
  const [coverLetter, setCoverLetter] = useState(initialCoverLetter || '')
  const [company, setCompany]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [copied, setCopied]           = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const { generateCoverLetter, getCoverLetterStatus } = await import('../api/resumes')
      await generateCoverLetter(resumeId, { company })

      // Poll for result
      const poll = setInterval(async () => {
        const { data } = await getCoverLetterStatus(resumeId)
        if (data.ready) {
          clearInterval(poll)
          setCoverLetter(data.cover_letter)
          setLoading(false)
        }
      }, 2000)
    } catch {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass p-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <FileText size={18} className="text-brand-400" /> Cover Letter
      </h3>

      {!coverLetter ? (
        <div className="space-y-3">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name (optional)"
            className="input-dark"
          />
          <Button onClick={generate} loading={loading} className="w-full justify-center">
            ✍️ Generate cover letter
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-white/3 border border-white/5 rounded-xl p-4 text-white/70 text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
            {coverLetter}
          </div>
          <div className="flex gap-3">
            <Button onClick={copy} variant="ghost" className="flex-1 justify-center">
              {copied ? '✅ Copied!' : '📋 Copy'}
            </Button>
            <Button onClick={() => setCoverLetter('')} variant="ghost" className="flex-1 justify-center">
              <RefreshCw size={16} /> Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Interview Section
function InterviewSection({ resumeId, initialQuestions }) {
  const [questions, setQuestions] = useState(initialQuestions || [])
  const [loading, setLoading]     = useState(false)
  const [answers, setAnswers]     = useState({})

  const generate = async () => {
    setLoading(true)
    try {
      const { generateInterview, getInterviewStatus } = await import('../api/resumes')
      await generateInterview(resumeId)

      const poll = setInterval(async () => {
        const { data } = await getInterviewStatus(resumeId)
        if (data.ready) {
          clearInterval(poll)
          setQuestions(data.questions)
          setLoading(false)
        }
      }, 2000)
    } catch {
      setLoading(false)
    }
  }

  const diffColors = {
    easy  : 'bg-green-500/20 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
    hard  : 'bg-red-500/20 text-red-400 border-red-500/20',
  }

  const categoryColors = {
    Technical  : 'bg-blue-500/20 text-blue-400',
    Behavioral : 'bg-purple-500/20 text-purple-400',
    Experience : 'bg-orange-500/20 text-orange-400',
    Situational: 'bg-cyan-500/20 text-cyan-400',
  }

  if (!questions.length) return (
    <div className="glass p-8 text-center">
      <p className="text-4xl mb-4">🎤</p>
      <h3 className="text-xl font-semibold text-white mb-2">Interview preparation</h3>
      <p className="text-white/40 mb-6 text-sm">
        Get 10 personalized interview questions based on your resume
      </p>
      <Button onClick={generate} loading={loading} className="mx-auto">
        🎯 Generate interview questions
      </Button>
    </div>
  )

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/30 text-sm font-mono">#{i + 1}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[q.category] || 'bg-white/10 text-white/40'}`}>
              {q.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${diffColors[q.difficulty] || ''}`}>
              {q.difficulty}
            </span>
          </div>

          <p className="text-white font-medium mb-3">{q.question}</p>

          {q.hint && (
            <div className="text-xs text-white/30 bg-white/3 rounded-lg p-2 mb-3">
              💡 {q.hint}
            </div>
          )}

          <textarea
            value={answers[i] || ''}
            onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
            placeholder="Write your answer here to practice..."
            rows={3}
            className="input-dark text-sm resize-none"
          />
        </motion.div>
      ))}
    </div>
  )
}