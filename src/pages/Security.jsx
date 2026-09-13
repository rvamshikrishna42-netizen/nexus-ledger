import { useState } from 'react'
import {
  ShieldAlert, Shield, CheckCircle, AlertTriangle, XCircle,
  Fingerprint, Monitor, Award, Package, Lock, Link2,
  TrendingUp, Bell, Clock
} from 'lucide-react'
import { DEMO_SECURITY_EVENTS, DEMO_ANOMALIES } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'

const SECURITY_DOMAINS = [
  { label: 'Identity Security',     score: 95, icon: Fingerprint, color: 'blue',   detail: '5 DIDs registered, 4 verified on blockchain' },
  { label: 'Device Security',       score: 72, icon: Monitor,     color: 'cyan',   detail: '1 suspicious device detected — TOR browser' },
  { label: 'Certificate Integrity', score: 80, icon: Award,       color: 'green',  detail: '3 verified, 1 suspicious, 1 tampered cert' },
  { label: 'Asset Security',        score: 90, icon: Package,     color: 'purple', detail: '4 active assets, all hashes verified on-chain' },
  { label: 'Access Control',        score: 98, icon: Lock,        color: 'orange', detail: 'RBAC enforced, all roles correctly assigned' },
  { label: 'Blockchain Integrity',  score: 100, icon: Link2,      color: 'indigo', detail: '7 transactions confirmed, 0 rollbacks' },
]

const SEVERITY_CONFIG = {
  Critical: { cls: 'text-red-400 bg-red-500/10 border-red-500/20', dot: 'bg-red-500 animate-pulse' },
  High:     { cls: 'text-orange-400 bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-500' },
  Medium:   { cls: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-500' },
  Info:     { cls: 'text-blue-400 bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-500' },
}

const ALERTS = [
  { id: 1, severity: 'Critical', title: 'Suspicious device detected — TOR exit node', time: '2h ago', action: 'Revoke Device' },
  { id: 2, severity: 'Critical', title: 'Certificate hash mismatch — possible tampering', time: '3h ago', action: 'Review Certificate' },
  { id: 3, severity: 'High',     title: 'Brute-force login attempt: 14 failed logins', time: '3h ago', action: 'Block IP' },
  { id: 4, severity: 'High',     title: 'Asset transfer outside business hours', time: '12h ago', action: 'Review Transfer' },
  { id: 5, severity: 'Medium',   title: 'New device registered for user Rahul Verma', time: '1d ago', action: 'Verify Device' },
  { id: 6, severity: 'Medium',   title: 'DID verification failed 3 times', time: '4d ago', action: 'Investigate' },
]

function ScoreRing({ score, color, size = 80 }) {
  const r = size / 2 - 8
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  const colorMap = {
    blue: '#3b82f6', cyan: '#06b6d4', green: '#10b981',
    purple: '#8b5cf6', orange: '#f59e0b', indigo: '#6366f1',
    emerald: '#10b981',
  }
  const c = colorMap[color] || '#3b82f6'

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
    </svg>
  )
}

export default function Security() {
  const [dismissedAlerts, setDismissedAlerts] = useState([])
  const activeAlerts = ALERTS.filter(a => !dismissedAlerts.includes(a.id))
  const overallScore = Math.round(SECURITY_DOMAINS.reduce((a, d) => a + d.score, 0) / SECURITY_DOMAINS.length)
  const recentEvents = DEMO_SECURITY_EVENTS.slice(0, 8)

  const colorMap = {
    blue: 'text-blue-400', cyan: 'text-cyan-400', green: 'text-emerald-400',
    purple: 'text-purple-400', orange: 'text-orange-400', indigo: 'text-indigo-400',
  }

  return (
    <div className="space-y-5">
      {/* Overall score hero */}
      <div className="glass-card p-6 bg-gradient-to-br from-blue-600/5 to-purple-600/5 border-blue-500/15">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="relative">
            <ScoreRing score={overallScore} color="emerald" size={100} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-emerald-400">{overallScore}</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {overallScore >= 90 ? '🟢 SYSTEM SECURE' : overallScore >= 70 ? '🟡 NEEDS ATTENTION' : '🔴 AT RISK'}
            </div>
            <p className="text-sm text-gray-400">Overall security score based on identity, device, certificate, asset, RBAC, and blockchain integrity checks.</p>
            <div className="flex gap-3 mt-3">
              <span className="badge-green"><CheckCircle size={10} />Blockchain: Intact</span>
              <span className="badge-green"><CheckCircle size={10} />RBAC: Enforced</span>
              <span className="badge-red"><AlertTriangle size={10} />1 Critical Alert</span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain scores */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SECURITY_DOMAINS.map(({ label, score, icon: Icon, color, detail }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon size={15} className={colorMap[color]} />
                <span className="text-sm font-medium text-white">{label}</span>
              </div>
              <span className={`text-lg font-bold ${colorMap[color]}`}>{score}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
              <div className={`h-full rounded-full ${
                score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`} style={{ width: `${score}%` }}></div>
            </div>
            <p className="text-xs text-gray-500">{detail}</p>
          </div>
        ))}
      </div>

      {/* Active alerts */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-header mb-0">
            <Bell size={15} className="text-orange-400" />
            Security Alerts
            {activeAlerts.length > 0 && (
              <span className="ml-2 bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-2 py-0.5 rounded-full">
                {activeAlerts.length} active
              </span>
            )}
          </h3>
        </div>

        <div className="space-y-2">
          {activeAlerts.map(alert => {
            const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.Info
            return (
              <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg border ${cfg.cls}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}></span>
                  <div>
                    <div className="text-sm font-medium">{alert.title}</div>
                    <div className="text-xs opacity-60 mt-0.5">{alert.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.cls}`}>{alert.severity}</span>
                  <button onClick={() => setDismissedAlerts(p => [...p, alert.id])}
                    className="p-1 hover:bg-white/10 rounded text-current opacity-50 hover:opacity-100 transition-opacity">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            )
          })}
          {activeAlerts.length === 0 && (
            <div className="text-center py-8 text-emerald-400">
              <CheckCircle size={32} className="mx-auto mb-2" />
              <div className="font-medium">All alerts dismissed</div>
              <div className="text-xs text-gray-500 mt-1">No active security alerts</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent events */}
      <div className="glass-card p-5">
        <h3 className="section-header mb-4">
          <Clock size={15} className="text-blue-400" />
          Recent Security Events
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr>
                {['Time', 'Event Type', 'User', 'IP', 'Severity', 'Details'].map(h => (
                  <th key={h} className="table-header text-left py-2 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEvents.map(evt => (
                <tr key={evt.id} className="hover:bg-white/2 transition-colors">
                  <td className="table-cell font-mono text-xs text-gray-500">
                    {new Date(evt.timestamp).toLocaleString('en-IN', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </td>
                  <td className="table-cell">
                    <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-blue-300">{evt.type}</code>
                  </td>
                  <td className="table-cell text-sm text-gray-300">{evt.user}</td>
                  <td className="table-cell font-mono text-xs text-gray-500">{evt.ip}</td>
                  <td className="table-cell"><StatusBadge status={evt.severity} /></td>
                  <td className="table-cell text-xs text-gray-400">{evt.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
