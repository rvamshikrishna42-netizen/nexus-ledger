import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Contains number', pass: /\d/.test(password) },
    { label: 'Contains special char', pass: /[^a-zA-Z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const bar = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'][score - 1] || 'bg-gray-600'

  if (!password) return null
  return (
    <div className="mt-2">
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${bar} transition-all`} style={{ width: `${score * 25}%` }}></div>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1 text-xs ${c.pass ? 'text-emerald-400' : 'text-gray-500'}`}>
            <CheckCircle size={10} className={c.pass ? 'text-emerald-400' : 'text-gray-600'} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setLoading(true)
    const result = await register(form.name, form.email, form.password)
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0e1a]">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 64 64" fill="none">
              <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" stroke="white" strokeWidth="4" fill="none"/>
              <circle cx="32" cy="32" r="8" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-white">NEXUS LEDGER</span>
        </Link>

        <div className="glass-card p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-sm text-gray-500">Join the decentralized identity network</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                className="input-field"
                placeholder="Arjun Sharma"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={set('confirm')}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500">
              <Shield size={12} className="mt-0.5 text-blue-400 flex-shrink-0" />
              A Decentralized Identity (DID) will be automatically generated and anchored on the blockchain upon registration.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating Identity...
                </span>
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Nexus Ledger — PS 26125 — Bharat Electronics Limited — SIH 2024
        </p>
      </div>
    </div>
  )
}
