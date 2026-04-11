import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Briefcase, Camera,
  Lock, Trash2, Save, CheckCircle,
  Shield, AlertTriangle, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import toast from 'react-hot-toast'

// Section wrapper
function Section({ title, subtitle, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-6"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <div className="w-9 h-9 bg-brand-500/20 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-brand-400" />
        </div>
        <div>
          <h2 className="text-white font-semibold">{title}</h2>
          {subtitle && <p className="text-white/30 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  )
}

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const fileRef                   = useRef(null)

  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name : user?.last_name  || '',
    username  : user?.username   || '',
    email     : user?.email      || '',
    bio       : user?.bio        || '',
    job_title : user?.job_title  || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
  })

  const [profileLoading,  setProfileLoading]  = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarLoading,   setAvatarLoading]   = useState(false)
  const [deleteLoading,   setDeleteLoading]   = useState(false)
  const [profileErrors,   setProfileErrors]   = useState({})
  const [passwordErrors,  setPasswordErrors]  = useState({})
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  useEffect(() => {
    setAvatarPreview(user?.avatar_url || null)
  }, [user])

  // Update profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileErrors({})
    try {
      const formData = new FormData()
      Object.entries(profileForm).forEach(([k, v]) => formData.append(k, v))
      const { data } = await api.patch('/auth/profile/', formData)
      setUser(data)
      toast.success('Profile updated!')
    } catch (err) {
      const errors = err.response?.data
      if (errors && typeof errors === 'object') setProfileErrors(errors)
      else toast.error('Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordErrors({})
    try {
      await api.post('/auth/change-password/', passwordForm)
      setPasswordForm({ old_password: '', new_password: '' })
      toast.success('Password changed successfully!')
    } catch (err) {
      const errors = err.response?.data
      if (errors && typeof errors === 'object') setPasswordErrors(errors)
      else toast.error('Failed to change password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5MB')
        return
    }

   
    const localPreview = URL.createObjectURL(file)
    setAvatarPreview(localPreview)
    setAvatarLoading(true)

    try {
        const formData = new FormData()
        formData.append('avatar', file)
        const { data } = await api.patch('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        })
        setUser(data)
        setAvatarPreview(`${data.avatar_url}?t=${Date.now()}`)
        toast.success('Avatar updated!')
    } catch {
        toast.error('Failed to upload avatar.')
        setAvatarPreview(user?.avatar_url || null)
    } finally {
        setAvatarLoading(false)
    }
  }
    const handleDeleteAvatar = async () => {
        try {
            const { data } = await api.delete('/auth/avatar/delete/')
            setUser(data)
            //setAvatarPreview(null)
            toast.success('Avatar removed!')
        } catch {
            toast.error('Failed to remove avatar.')
        }
    }

  // Delete account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      await api.delete('/auth/delete/')
      logout()
      toast.success('Account deleted.')
    } catch {
      toast.error('Failed to delete account.')
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">My profile</h1>
          <p className="text-white/40 mt-1">Manage your account settings</p>
        </motion.div>

        {/* Avatar section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 flex items-center gap-6"
        >
          {/* Avatar */}
        <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-2xl overflow-hidden">
            {avatarPreview ? (
            <img
                key={avatarPreview}
                src={avatarPreview}
                className="w-full h-full object-cover"
                alt="avatar"
            />
            ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-3xl font-black text-white">
                {user?.first_name?.[0] || user?.username?.[0]}
            </div>
            )}
        </div>

        {/* Upload button */}
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileRef.current?.click()}
            disabled={avatarLoading}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center border-2 border-dark-300 hover:bg-brand-600 transition"
        >
            {avatarLoading
            ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Camera size={13} className="text-white" />
            }
        </motion.button>

        {/*Delete button */}
        {avatarPreview && (
            <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDeleteAvatar}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-dark-300 hover:bg-red-600 transition"
            >
            <X size={10} className="text-white" />
            </motion.button>
        )}

        <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
        />
        </div>

          <div>
            <p className="text-white font-semibold text-lg">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.username
              }
            </p>
            <p className="text-white/40 text-sm">{user?.email}</p>
            <p className="text-white/30 text-xs mt-1">
              {user?.resumes_count} resume{user?.resumes_count !== 1 ? 's' : ''} analyzed
            </p>
          </div>
        </motion.div>

        {/* Profile form */}
        <Section
          title="Personal information"
          subtitle="Update your profile details"
          icon={User}
          delay={0.2}
        >
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                value={profileForm.first_name}
                onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                placeholder="John"
                error={profileErrors.first_name?.[0]}
              />
              <Input
                label="Last name"
                value={profileForm.last_name}
                onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                placeholder="Doe"
                error={profileErrors.last_name?.[0]}
              />
            </div>
            <Input
              label="Username"
              value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              placeholder="johndoe"
              error={profileErrors.username?.[0]}
            />
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="john@example.com"
              error={profileErrors.email?.[0]}
            />
            <Input
              label="Job title"
              icon={Briefcase}
              value={profileForm.job_title}
              onChange={(e) => setProfileForm({ ...profileForm, job_title: e.target.value })}
              placeholder="Senior Python Developer"
              error={profileErrors.job_title?.[0]}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/70">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
                className="input-dark resize-none"
              />
            </div>
            <Button
              type="submit"
              loading={profileLoading}
              className="w-full justify-center"
            >
              <Save size={16} /> Save changes
            </Button>
          </form>
        </Section>

        {/* Password form */}
        <Section
          title="Change password"
          subtitle="Keep your account secure"
          icon={Lock}
          delay={0.3}
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current password"
              type="password"
              icon={Lock}
              value={passwordForm.old_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
              placeholder="••••••••"
              error={passwordErrors.old_password}
            />
            <Input
              label="New password"
              type="password"
              icon={Shield}
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              placeholder="Min 8 characters"
              error={passwordErrors.new_password?.[0]}
            />
            <Button
              type="submit"
              loading={passwordLoading}
              className="w-full justify-center"
            >
              <Lock size={16} /> Change password
            </Button>
          </form>
        </Section>

        {/* Danger zone */}
        <Section
          title="Danger zone"
          subtitle="Irreversible actions"
          icon={AlertTriangle}
          delay={0.4}
        >
          <div className="border border-red-500/20 rounded-xl p-4 bg-red-500/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-medium text-sm">Delete account</p>
                <p className="text-white/40 text-xs mt-1">
                  This will permanently delete your account and all your resumes.
                  This action cannot be undone.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-shrink-0"
              >
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </div>
        </Section>

        {/* Delete confirmation modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass p-6 max-w-sm w-full"
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">⚠️</div>
                  <h3 className="text-white font-bold text-lg">Delete your account?</h3>
                  <p className="text-white/40 text-sm mt-2">
                    All your resumes and analyses will be permanently deleted.
                    This cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 justify-center"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    loading={deleteLoading}
                    onClick={handleDeleteAccount}
                    className="flex-1 justify-center"
                  >
                    <Trash2 size={14} /> Delete forever
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}