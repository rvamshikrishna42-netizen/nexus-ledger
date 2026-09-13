import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, AlertCircle, ArrowRight, Copy } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const DEMO_CREDS = [
  { role: 'Super Admin', email: 'admin@nexusledger.demo', password: 'Admin@123', color: 'blue' },
  { role: 'User', email: 'user@nexusledger.demo', password: 'User@123', color: 'purple' },
  { role: 'Auditor', email: 'auditor@nexusledger.demo', password: 'Audit@123', color: 'cyan' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  const fill = (cred) => {
    setEmail(cred.email)
    setPassword(cred.password)
    setError('')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0d1226] border-r border-white/5 p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl"></div>
        </div>
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
              <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" stroke="white" strokeWidth="3" fill="none"/>
              <circle cx="32" cy="32" r="7" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="font-bold text-white">NEXUS LEDGER</div>
            <div className="text-xs text-blue-400">BEL SIH 2024</div>
          </div>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Decentralized Identity.<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Intelligent Security.</span>
          </h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Blockchain-secured platform for identity, access control, and digital asset management.
            Built for Bharat Electronics Limited.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['SHA-256 Integrity', 'DID Management', 'RBAC', 'NFT Assets', 'Audit Trail', 'Risk Engine'].map(f => (
              <span key={f} className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-600 relative z-10">PS 26125 — Theme: Blockchain & Cybersecurity</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0e1a]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
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
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
              <p className="text-sm text-gray-500">Sign in to your secure workspace</p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@nexusledger.demo"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">New to Nexus Ledger? </span>
              <Link to="/register" className="text-sm text-blue-400 hover:text-blue-300 font-medium">Create account</Link>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Demo Credentials</span>
            </div>
            <div className="space-y-2">
              {DEMO_CREDS.map(cred => (
                <button
                  key={cred.role}
                  onClick={() => fill(cred)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/3 hover:bg-white/8 border border-white/5 hover:border-blue-500/20 transition-all text-left"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{cred.role}</div>
                    <div className="text-xs text-gray-500 font-mono">{cred.email}</div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">{cred.password}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
