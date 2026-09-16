import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  ShieldCheck,
  LockKeyhole,
  Cpu,
  Blocks,
  AlertTriangle,
  Activity,
  ScanLine
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import TrustCoreCanvas from '../components/trust-core/TrustCoreCanvas'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('admin@nexusledger.demo')
  const [password, setPassword] = useState('Admin@123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Invalid credentials')
    }

    setLoading(false)
  }

  const demoLogin = (email, password) => {
    setEmail(email)
    setPassword(password)
    setError('')
  }

  return (
    <main className="nexus-auth-3d">

      {/* =====================================================
          AMBIENT 3D BACKGROUND
      ===================================================== */}

      <div className="auth-3d-background">
        <div className="auth-3d-grid" />
        <div className="auth-3d-glow glow-blue" />
        <div className="auth-3d-glow glow-purple" />
        <div className="auth-3d-glow glow-cyan" />

        <div className="auth-particle particle-1" />
        <div className="auth-particle particle-2" />
        <div className="auth-particle particle-3" />
        <div className="auth-particle particle-4" />
        <div className="auth-particle particle-5" />
        <div className="auth-particle particle-6" />
      </div>

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="auth-3d-nav">

        <Link to="/" className="auth-3d-brand">
          <span className="auth-3d-logo">N</span>

          <span>
            NEXUS<span>LEDGER</span>
          </span>
        </Link>

        <div className="auth-system-state">
          <span className="state-pulse" />
          <span>SECURITY NETWORK</span>
          <strong>ONLINE</strong>
        </div>

        <Link to="/" className="auth-return">
          Back to Platform
          <ArrowRight size={14} />
        </Link>

      </header>

      {/* =====================================================
          MAIN AUTHENTICATION EXPERIENCE
      ===================================================== */}

      <section className="auth-3d-main">

        {/* ===================================================
            LEFT 3D TRUST CORE
        =================================================== */}

        <div className="auth-3d-visual">

          <div className="visual-header">
            <div>
              <span>IDENTITY AUTHENTICATION</span>
              <strong>NEXUS TRUST CORE</strong>
            </div>

            <div className="visual-live">
              <Activity size={13} />
              LIVE
            </div>
          </div>

          <div className="auth-core-stage">

            <div className="core-hud hud-top">
              <ScanLine size={13} />
              ENCRYPTED CHANNEL
            </div>

            <div className="core-hud hud-left">
              <span>IDENTITY</span>
              <strong>VERIFIED</strong>
            </div>

            <div className="core-hud hud-right">
              <span>THREAT LEVEL</span>
              <strong>LOW</strong>
            </div>

            <div className="core-hud hud-bottom">
              <span>TRUST SCORE</span>
              <strong>98.7%</strong>
            </div>

            {/* Existing Three.js Trust Core */}
            <div className="auth-trust-canvas">
              <TrustCoreCanvas inHero={true} />
            </div>

            {/* Additional depth rings */}
            <div className="auth-orbit orbit-a" />
            <div className="auth-orbit orbit-b" />
            <div className="auth-orbit orbit-c" />

          </div>

          {/* Security modules */}

          <div className="auth-module-grid">

            <div className="auth-module">
              <div className="module-icon">
                <Fingerprint size={16} />
              </div>
              <div>
                <small>DIGITAL IDENTITY</small>
                <strong>VERIFIED</strong>
              </div>
            </div>

            <div className="auth-module">
              <div className="module-icon">
                <LockKeyhole size={16} />
              </div>
              <div>
                <small>ACCESS CONTROL</small>
                <strong>RBAC ACTIVE</strong>
              </div>
            </div>

            <div className="auth-module">
              <div className="module-icon">
                <Cpu size={16} />
              </div>
              <div>
                <small>AI SECURITY</small>
                <strong>MONITORING</strong>
              </div>
            </div>

            <div className="auth-module">
              <div className="module-icon">
                <Blocks size={16} />
              </div>
              <div>
                <small>BLOCKCHAIN</small>
                <strong>CONNECTED</strong>
              </div>
            </div>

          </div>

        </div>

        {/* ===================================================
            LOGIN PANEL
        =================================================== */}

        <div className="auth-3d-form-area">

          <div className="auth-3d-card">

            <div className="card-depth-line" />
            <div className="card-light" />

            <div className="auth-card-heading">

              <div className="auth-lock-orb">
                <LockKeyhole size={21} />
                <span />
              </div>

              <div>
                <div className="auth-card-kicker">
                  SECURE AUTHENTICATION
                </div>

                <h1>Welcome back</h1>

                <p>
                  Sign in to your secure NEXUS workspace
                </p>
              </div>

            </div>

            {error && (
              <div className="auth-3d-error">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>

              {/* EMAIL */}

              <label className="auth-field-label">
                EMAIL ADDRESS
              </label>

              <div className="auth-3d-input">

                <Fingerprint size={17} />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />

                <span className="input-status" />

              </div>

              {/* PASSWORD */}

              <label className="auth-field-label">
                PASSWORD
              </label>

              <div className="auth-3d-input">

                <LockKeyhole size={17} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword
                    ? <EyeOff size={17} />
                    : <Eye size={17} />
                  }
                </button>

              </div>

              <div className="auth-session-info">

                <span>
                  <i />
                  Protected session
                </span>

                <span>
                  SHA-256
                </span>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="auth-3d-submit"
                disabled={loading}
              >

                <span className="submit-shine" />

                {loading ? (
                  <>
                    <span className="auth-spinner" />
                    AUTHENTICATING
                  </>
                ) : (
                  <>
                    SIGN IN
                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </form>

            {/* DEMO */}

            <div className="auth-divider">
              <span>DEMO ACCESS</span>
            </div>

            <div className="auth-demo-grid">

              <button
                type="button"
                onClick={() =>
                  demoLogin(
                    'admin@nexusledger.demo',
                    'Admin@123'
                  )
                }
              >
                <strong>SUPER ADMIN</strong>
                <small>admin@nexusledger.demo</small>
              </button>

              <button
                type="button"
                onClick={() =>
                  demoLogin(
                    'user@nexusledger.demo',
                    'User@123'
                  )
                }
              >
                <strong>USER</strong>
                <small>user@nexusledger.demo</small>
              </button>

              <button
                type="button"
                onClick={() =>
                  demoLogin(
                    'auditor@nexusledger.demo',
                    'Audit@123'
                  )
                }
              >
                <strong>AUDITOR</strong>
                <small>auditor@nexusledger.demo</small>
              </button>

            </div>

            <div className="auth-create">

              <span>New to NEXUS LEDGER?</span>

              <Link to="/register">
                Create account
                <ArrowRight size={13} />
              </Link>

            </div>

            <div className="auth-card-footer">

              <span>
                <i />
                AI SECURITY ONLINE
              </span>

              <span>
                TRUST CORE ACTIVE
              </span>

              <span>
                TLS ENCRYPTED
              </span>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}