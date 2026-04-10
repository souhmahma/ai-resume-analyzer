import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Upload, FileText, Trash2,
  TrendingUp, Clock, Award, Plus,
  BarChart3, ChevronRight, AlertCircle
} from 'lucide-react'
import { getResumes, deleteResume } from '../api/resumes'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import LoadingScreen from '../components/ui/LoadingScreen'
import toast from 'react-hot-toast'

// Stat card
function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-white/40 text-sm mt-1">{label}</p>
    </motion.div>
  )
}

// Resume card
function ResumeCard({ resume, onDelete, delay }) {
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const statusConfig = {
    uploaded : { label: 'Uploaded',  color: 'bg-blue-500/20 text-blue-400',   dot: 'bg-blue-400' },
    parsing  : { label: 'Parsing',   color: 'bg-yellow-500/20 text-yellow-400', dot: 'bg-yellow-400' },
    analyzing: { label: 'Analyzing', color: 'bg-purple-500/20 text-purple-400', dot: 'bg-purple-400 animate-pulse' },
    done     : { label: 'Done',      color: 'bg-green-500/20 text-green-400',  dot: 'bg-green-400' },
    failed   : { label: 'Failed',    color: 'bg-red-500/20 text-red-400',      dot: 'bg-red-400' },
  }

  const status = statusConfig[resume.status] || statusConfig.uploaded

  const scoreColor = resume.score >= 85
    ? 'text-green-400'
    : resume.score >= 70
    ? 'text-blue-400'
    : resume.score >= 50
    ? 'text-yellow-400'
    : 'text-red-400'

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm('Delete this resume?')) return
    setDeleting(true)
    try {
      await deleteResume(resume.id)
      onDelete(resume.id)
      toast.success('Resume deleted')
    } catch {
      setDeleting(false)
      toast.error('Failed to delete')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="glass-hover p-5 cursor-pointer group"
      onClick={() => resume.has_analysis && navigate(`/results/${resume.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
            <FileText size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm truncate max-w-[180px]">
              {resume.filename}
            </p>
            <p className="text-white/30 text-xs mt-0.5">
              {resume.job_title || 'No job title'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Score */}
          {resume.score && (
            <span className={`text-lg font-black ${scoreColor}`}>
              {resume.score}%
            </span>
          )}

          {/* Delete button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            {deleting
              ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              : <Trash2 size={14} />
            }
          </motion.button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${status.color}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </div>
        <p className="text-white/20 text-xs">
          {new Date(resume.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* View results CTA */}
      {resume.has_analysis && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-brand-400">
          <span>View full analysis</span>
          <ChevronRight size={14} />
        </div>
      )}

      {/* Analyzing indicator */}
      {['parsing', 'analyzing'].includes(resume.status) && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/3 bg-brand-500 rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function Dashboard() {
  const { user }                  = useAuth()
  const [resumes, setResumes]     = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = async () => {
    try {
      const { data } = await getResumes()
      setResumes(data)
    } catch {
      toast.error('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    setResumes(prev => prev.filter(r => r.id !== id))
  }

  // Stats
  const total     = resumes.length
  const done      = resumes.filter(r => r.status === 'done').length
  const avgScore  = done > 0
    ? Math.round(resumes.filter(r => r.score).reduce((acc, r) => acc + r.score, 0) / done)
    : 0
  const bestScore = resumes.reduce((max, r) => r.score > max ? r.score : max, 0)

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              Hello, {user?.first_name || user?.username} 👋
            </h1>
            <p className="text-white/40 mt-1">
              {total === 0
                ? 'Upload your first resume to get started'
                : `You have ${total} resume${total > 1 ? 's' : ''} analyzed`
              }
            </p>
          </div>
          <Link to="/analyze">
            <Button className="flex items-center gap-2">
              <Plus size={16} /> New analysis
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText}   label="Total resumes"  value={total}              color="bg-brand-500"    delay={0} />
          <StatCard icon={BarChart3}  label="Analyzed"       value={done}               color="bg-accent-purple" delay={0.1} />
          <StatCard icon={TrendingUp} label="Average score"  value={avgScore ? `${avgScore}%` : '—'} color="bg-accent-cyan" delay={0.2} />
          <StatCard icon={Award}      label="Best score"     value={bestScore ? `${bestScore}%` : '—'} color="bg-green-500" delay={0.3} />
        </div>

        {/* Resumes list */}
        {total === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-16 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              📄
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">No resumes yet</h2>
            <p className="text-white/40 mb-6">
              Upload your first resume and get an AI-powered analysis in seconds.
            </p>
            <Link to="/analyze">
              <Button className="mx-auto">
                <Upload size={16} /> Upload my resume
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">My resumes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {resumes.map((resume, i) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    onDelete={handleDelete}
                    delay={i * 0.05}
                  />
                ))}
              </AnimatePresence>

              {/* Add new card */}
              <Link to="/analyze">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: resumes.length * 0.05 }}
                  whileHover={{ y: -4, borderColor: 'rgba(99,102,241,0.5)' }}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-5 h-full min-h-[140px] flex flex-col items-center justify-center gap-3 text-white/30 hover:text-brand-400 transition cursor-pointer"
                >
                  <div className="w-10 h-10 border-2 border-current rounded-xl flex items-center justify-center">
                    <Plus size={18} />
                  </div>
                  <p className="text-sm font-medium">Add new resume</p>
                </motion.div>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}