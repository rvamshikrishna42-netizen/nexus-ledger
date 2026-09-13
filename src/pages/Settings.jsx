import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  User, Shield, Bell, Database, Link2, LogOut,
  CheckCircle, Save, Eye, EyeOff, Info
} from 'lucide-react'

export default function AppSettings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [showPw, setShowPw] = useState(false)
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

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const setPref = k => e => setPrefs(p => ({ ...p, [k]: e.target.checked }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const TABS = [
    { id: 'profile',   label: 'Profile', icon: User },
    { id: 'security',  label: 'Security', icon: Shield },
    { id: 'notif',     label: 'Notifications', icon: Bell },
    { id: 'system',    label: 'System', icon: Database },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Tab bar */}
      <div className="flex gap-2 border-b border-white/5 pb-3">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg transition-all ${
              tab === id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="glass-card p-6 space-y-5">
          <h3 className="font-semibold text-white">Profile Information</h3>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.avatar}
            </div>
            <div>
              <div className="font-semibold text-white">{user?.name}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
              <div className="mt-1">
                <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
              <input className="input-field" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input className="input-field" value={form.email} onChange={set('email')} type="email" />
            </div>
          </div>

          {/* DID */}
          <div className="bg-white/3 rounded-lg p-4 border border-white/5">
            <div className="text-xs text-gray-500 mb-1.5">Your Decentralized Identity (DID)</div>
            <code className="text-xs text-blue-300 font-mono break-all">{user?.did || 'did:nexus:not-yet-assigned'}</code>
          </div>

          <button onClick={handleSave} className="btn-primary w-full justify-center">
            {saved ? <><CheckCircle size={15} />Saved!</> : <><Save size={15} />Save Changes</>}
          </button>
        </div>
      )}

      {tab === 'security' && (
        <div className="glass-card p-6 space-y-5">
          <h3 className="font-semibold text-white">Security Settings</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input className="input-field pr-10" type={showPw ? 'text' : 'password'} value={form.currentPw} onChange={set('currentPw')} placeholder="••••••••" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
              <input className="input-field" type="password" value={form.newPw} onChange={set('newPw')} placeholder="••••••••" />
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary w-full justify-center">
            {saved ? <><CheckCircle size={15} />Saved!</> : <><Save size={15} />Update Password</>}
          </button>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <h4 className="text-sm font-medium text-white">Active Sessions</h4>
            <div className="p-3 bg-white/3 rounded-lg border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-sm text-white">Current Session</div>
                <div className="text-xs text-gray-500 mt-0.5">Browser • {new Date().toLocaleDateString()}</div>
              </div>
              <span className="badge-green"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" /> Active</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
              <LogOut size={15} /> Sign Out of All Sessions
            </button>
          </div>
        </div>
      )}

      {tab === 'notif' && (
        <div className="glass-card p-6 space-y-5">
          <h3 className="font-semibold text-white">Notification Preferences</h3>

          <div className="space-y-3">
            {[
              { key: 'emailAlerts', label: 'Email Security Alerts', desc: 'Receive critical security events via email' },
              { key: 'anomalyAlerts', label: 'Anomaly Notifications', desc: 'Notify when anomalies are detected in your account' },
              { key: 'deviceAlerts', label: 'New Device Alerts', desc: 'Alert when your account is accessed from a new device' },
              { key: 'certAlerts', label: 'Certificate Expiry', desc: 'Warn when certificates are approaching expiry' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between p-3 bg-white/3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                <div>
                  <div className="text-sm text-white">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
                <div className="relative ml-4">
                  <input type="checkbox" className="sr-only" checked={prefs[key]} onChange={setPref(key)} />
                  <div className={`w-10 h-5 rounded-full transition-colors ${prefs[key] ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button onClick={handleSave} className="btn-primary w-full justify-center">
            {saved ? <><CheckCircle size={15} />Saved!</> : <><Save size={15} />Save Preferences</>}
          </button>
        </div>
      )}

      {tab === 'system' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">System Information</h3>
            <div className="space-y-2">
              {[
                { label: 'Platform', value: 'Nexus Ledger v1.0' },
                { label: 'Mode', value: 'DEMO MODE (No live backend)' },
                { label: 'Blockchain', value: 'DEMO BLOCKCHAIN (No MetaMask)' },
                { label: 'Frontend', value: 'React 18 + Vite 5 + Tailwind CSS 3' },
                { label: 'SIH Problem', value: 'PS 26125 — Bharat Electronics Limited' },
                { label: 'Theme', value: 'Blockchain & Cybersecurity' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-200">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 bg-yellow-500/5 border-yellow-500/15">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-yellow-300">Demo Mode Active:</strong> All data shown is simulated.
                To connect a real MySQL database, edit <code className="text-blue-300">backend/config.php</code> with your database credentials.
                To connect real blockchain, install MetaMask and configure the network in <code className="text-blue-300">src/lib/blockchain.js</code>.
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-3">Demo Credentials</h3>
            <div className="space-y-2">
              {[
                { role: 'Super Admin', email: 'admin@nexusledger.demo', password: 'Admin@123' },
                { role: 'User', email: 'user@nexusledger.demo', password: 'User@123' },
                { role: 'Auditor', email: 'auditor@nexusledger.demo', password: 'Audit@123' },
              ].map(c => (
                <div key={c.role} className="p-3 bg-white/3 rounded-lg border border-white/5 text-xs font-mono flex items-center justify-between">
                  <div>
                    <span className="text-blue-400 font-semibold mr-2">{c.role}</span>
                    <span className="text-gray-400">{c.email}</span>
                  </div>
                  <span className="text-gray-500">{c.password}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
