import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  User, Shield, Bell, Database, Link2, LogOut,
  CheckCircle, Save, Eye, EyeOff, Info, Layers, RotateCcw, Zap, Sparkles
} from 'lucide-react'
import { useTrustCore } from '../context/TrustCoreContext'

export default function AppSettings() {
  const { user, logout } = useAuth()
  const {
    autoRotate,
    setAutoRotate,
    particleDensity,
    setParticleDensity,
    resetThreat,
    threatLevel,
    riskScore,
  } = useTrustCore()

  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [calmMode, setCalmMode] = useState(true)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPw: '',
    newPw: '',
  })

  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    anomalyAlerts: true,
    deviceAlerts: true,
    certAlerts: true,
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setPref = (k) => (e) => setPrefs((p) => ({ ...p, [k]: e.target.checked }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'trustcore', label: '3D Trust Core', icon: Layers },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notif', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-mono">
      {/* Header */}
      <div>
        <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
          SYSTEM PREFERENCES & ARCHITECTURE
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Settings & Environment Controls
        </h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-white/5 pb-3 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap ${
              tab === id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* 3D Trust Core Calibration Tab */}
      {tab === 'trustcore' && (
        <div className="p-6 rounded-2xl bg-[#070b18]/90 border border-white/5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers size={16} className="text-blue-400" />
              <span>NEXUS Digital Trust Core Environment</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              CALM STATE ACTIVE
            </span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Configure WebGL hardware acceleration, orbital camera damping, and ambient particle emissions for the persistent 3D cybersecurity command deck.
          </p>

          <div className="space-y-3 pt-2">
            {/* Calm Mode Toggle */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Calm Core Mode</div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Reduces 3D orbital activity and resets threat pulses to a peaceful, low-risk state.
                </div>
              </div>
              <button
                onClick={() => {
                  setCalmMode(!calmMode)
                  resetThreat()
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  calmMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-gray-400'
                }`}
              >
                {calmMode ? 'ENABLED (CALM)' : 'DISABLED'}
              </button>
            </div>

            {/* Auto Orbit Rotation */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Continuous Scene Rotation</div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Subtle 0.35 rad/s orbital drift when viewport is idle.
                </div>
              </div>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  autoRotate
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-white/5 text-gray-400'
                }`}
              >
                {autoRotate ? 'ENABLED' : 'PAUSED'}
              </button>
            </div>

            {/* Particle Density */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Cyber Particle Field Density</div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Instanced GPU dust points in 3D coordinate space.
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {['low', 'medium', 'high'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setParticleDensity(d)}
                    className={`px-2.5 py-1 rounded text-[11px] uppercase transition-all ${
                      particleDensity === d
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="p-6 rounded-2xl bg-[#070b18]/90 border border-white/5 space-y-5">
          <h3 className="font-semibold text-white text-sm">Profile Information</h3>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
              {user?.avatar}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{user?.name}</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
              <div className="mt-1">
                <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full Name</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                value={form.name}
                onChange={set('name')}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email Address</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                value={form.email}
                onChange={set('email')}
                type="email"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] text-gray-500 mb-1">Assigned Decentralized Identity (DID)</div>
            <code className="text-xs text-cyan-300 break-all">{user?.did || 'did:nexus:7a82e4f9...'}</code>
          </div>

          <button onClick={handleSave} className="btn-primary w-full justify-center">
            {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Profile</>}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="p-6 rounded-2xl bg-[#070b18]/90 border border-white/5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Security & Cryptographic Keys</h3>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-gray-300">
            Passkey & Hardware Enclave Attestation active via FIDO2 / TPM 2.0.
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notif' && (
        <div className="p-6 rounded-2xl bg-[#070b18]/90 border border-white/5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Notification Channels</h3>
          <div className="space-y-2 text-xs text-gray-300">
            <div>Real-time SOC alerts dispatched to BEL command dashboard.</div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {tab === 'system' && (
        <div className="p-6 rounded-2xl bg-[#070b18]/90 border border-white/5 space-y-3">
          <h3 className="font-semibold text-white text-sm">Platform Build & Engine</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Engine: NEXUS 3D Trust Core v2.0</div>
            <div>Three.js + React Three Fiber + Drei</div>
            <div>Target: BEL PS 26125 Enterprise Mandate</div>
          </div>
        </div>
      )}
    </div>
  )
}
