import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Briefcase, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../api/axios'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const STAGES = [
  { id: 'upload',   label: 'Uploading file',     icon: '📤', duration: 1000 },
  { id: 'parse',    label: 'Reading content',    icon: '📖', duration: 1500 },
  { id: 'analyze',  label: 'AI analyzing...',    icon: '🧠', duration: 2000 },
  { id: 'scoring',  label: 'Calculating score', icon: '📊', duration: 1000 },
  { id: 'done',     label: 'Analysis complete', icon: '✅', duration: 0 },
]

export default function Analyze() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.job_title) {
        setJobTitle(user.job_title);
    }
   }, [user]);

  const isButtonDisabled = !file || !jobTitle.trim()
  
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('')
    if (rejectedFiles.length > 0) {
      setError('Invalid file. Please upload a PDF or DOCX file under 10MB.')
      return
    }
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  })

  const simulateStages = async () => {
    for (let i = 0; i < STAGES.length - 1; i++) {
      setStage(i)
      await new Promise(r => setTimeout(r, STAGES[i].duration))
    }
    setStage(STAGES.length - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_title', jobTitle)

    try {
      simulateStages()
      const { data } = await api.post('/resumes/upload/', formData, {
      headers: {
        'Content-Type': undefined, 
      },
      transformRequest: [(data) => data],
      })
      
      const resumeId = data.id
      const poll = setInterval(async () => {
        try {
          const { data: status } = await api.get(`/resumes/${resumeId}/status/`)
          if (status.status === 'done') {
            clearInterval(poll)
            await new Promise(r => setTimeout(r, 1000))
            navigate(`/results/${resumeId}`)
          } else if (status.status === 'failed') {
            clearInterval(poll)
            setLoading(false)
            setError('Analysis failed. Please try again.')
          }
        } catch (pollErr) {
          clearInterval(poll)
          setLoading(false)
          setError('Connection lost.')
        }
      }, 2000)

    } catch (err) {
      setLoading(false)
      setStage(0)
      setError(err.response?.data?.message || 'Upload failed.')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-3">
            Analyze your <span className="gradient-text">resume</span>
          </h1>
          <p className="text-white/50">
            Upload your CV and get AI-powered insights in seconds
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!loading ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div
                {...getRootProps()}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                  transition-all duration-300
                  ${isDragActive
                    ? 'border-brand-500 bg-brand-500/10'
                    : file
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-white/10 hover:border-white/30 bg-white/2'
                  }
                `}
              >
                <input {...getInputProps()} />
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3"
                    >
                      <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
                        <FileText size={28} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-white/40 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null) }}
                        className="inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                      >
                        <X size={14} /> Remove file
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <motion.div
                        animate={isDragActive ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
                        className="w-16 h-16 bg-brand-500/20 rounded-2xl flex items-center justify-center mx-auto"
                      >
                        <Upload size={28} className="text-brand-400" />
                      </motion.div>
                      <div>
                        <p className="text-white font-medium">
                          {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
                        </p>
                        <p className="text-white/40 text-sm mt-1">PDF or DOCX — max 10MB</p>
                      </div>
                      <p className="text-brand-400 text-sm">or click to browse</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="glass p-4">
                <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                  <Briefcase size={14} />
                  Target job title 
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Python Developer"
                  className="input-dark w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-500"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                className="w-full justify-center py-4 text-base"
              >
                🧠 Analyze my resume
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass p-8"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold text-white">
                  {STAGES[stage]?.label}
                </h2>
                <p className="text-white/40 text-sm mt-1">
                  Please wait while we analyze your resume...
                </p>
              </div>

              <div className="space-y-3">
                {STAGES.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      i < stage
                        ? 'bg-green-500/10 text-green-400'
                        : i === stage
                        ? 'bg-brand-500/10 text-brand-400'
                        : 'text-white/20'
                    }`}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-sm font-medium">{s.label}</span>
                    {i < stage && <CheckCircle size={16} className="ml-auto" />}
                    {i === stage && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="ml-auto w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
