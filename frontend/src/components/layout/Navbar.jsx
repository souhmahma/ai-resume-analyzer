import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location         = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = user ? [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analyze',   label: 'Analyze',   icon: Brain },
    /*{ href: '/profile',   label: 'Profile',   icon: User },*/
  ] : []

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-dark-300/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-purple rounded-lg flex items-center justify-center"
          >
            <Brain size={16} className="text-white" />
          </motion.div>
          <span className="font-bold text-white">
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${location.pathname === href
                  ? 'bg-brand-500/20 text-brand-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-8 h-8 rounded-full object-cover border border-brand-500/30" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-sm font-bold text-white">
                    {user.first_name?.[0] || user.username?.[0]}
                  </div>
                )}
                <span className="text-sm text-white/70">{user.first_name || user.username}</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <Link to="/login"    className="btn-ghost text-sm px-4 py-2">Login</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">Get started</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-2"
          >
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login"    className="btn-ghost text-center" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Get started</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}