import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Fingerprint, Package, Award, AlertTriangle, Monitor,
  ShieldAlert, Link2, TrendingUp, ArrowUpRight, ArrowRight,
  CheckCircle, XCircle, Clock, Activity
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import {
  DASHBOARD_STATS, CHART_DATA, DEMO_AUDIT_LOGS,
  DEMO_ANOMALIES, DEMO_SECURITY_EVENTS
} from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'

const STAT_CARDS = [
  { key: 'totalIdentities',       label: 'Total Identities',        icon: Fingerprint, color: 'blue',   to: '/identity',    suffix: '' },
  { key: 'digitalAssets',         label: 'Digital Assets',          icon: Package,     color: 'purple', to: '/assets',      suffix: '' },
  { key: 'verifiedCertificates',  label: 'Verified Certificates',   icon: Award,       color: 'green',  to: '/certificates',suffix: '' },
  { key: 'suspiciousCertificates',label: 'Suspicious Certs',        icon: AlertTriangle,color:'orange', to: '/certificates',suffix: '' },
  { key: 'trustedDevices',        label: 'Trusted Devices',         icon: Monitor,     color: 'cyan',   to: '/devices',     suffix: '' },
  { key: 'securityEvents',        label: 'Security Events',         icon: ShieldAlert, color: 'red',    to: '/security',    suffix: '' },
  { key: 'blockchainTransactions',label: 'Blockchain Txns',         icon: Link2,       color: 'indigo', to: '/blockchain',  suffix: '' },
  { key: 'securityScore',         label: 'Security Score',          icon: TrendingUp,  color: 'teal',   to: '/security',    suffix: '/100' },
]

const colorCls = {
  blue:   { icon: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20'   },
  purple: { icon: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
  green:  { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20'},
  orange: { icon: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
  cyan:   { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'   },
  red:    { icon: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20'    },
  indigo: { icon: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20' },
  teal:   { icon: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/20'   },
}

const TOOLTIP_STYLE = {
  contentStyle: { background: '#0d1226', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#9ca3af' },
  itemStyle:  { color: '#e5e7eb' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const recent = DEMO_AUDIT_LOGS.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's your security overview for today — {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
        {/* Security score badge */}
        <div className="hidden md:flex items-center gap-3 glass-card px-5 py-3">
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Overall Security Score</div>
            <div className="text-3xl font-black text-emerald-400 leading-none mt-0.5">
              {DASHBOARD_STATS.securityScore}
              <span className="text-sm text-gray-500 font-normal">/100</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-emerald-400/50 flex items-center justify-center bg-emerald-500/10">
            <CheckCircle size={20} className="text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, to, suffix }) => {
          const c = colorCls[color]
          const val = DASHBOARD_STATS[key]
          return (
            <Link key={key} to={to} className="stat-card hover:border-blue-500/20 hover:bg-white/8 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
                  <Icon size={16} className={c.icon} />
                </div>
                <ArrowUpRight size={14} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{val}{suffix}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Security Events — Area */}
        <div className="md:col-span-2 glass-card p-5">
          <div className="section-header mb-4">
            <Activity size={16} className="text-blue-400" />
            Security Events — Last 7 Days
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA.securityEvents}>
              <defs>
                <linearGradient id="evtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              <Area type="monotone" dataKey="events" name="All Events" stroke="#3b82f6" fill="url(#evtGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" fill="url(#critGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Certificate Results — Pie */}
        <div className="glass-card p-5">
          <div className="section-header mb-4">
            <Award size={16} className="text-green-400" />
            Certificate Results
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CHART_DATA.certResults} cx="50%" cy="50%" innerRadius={55} outerRadius={75}
                paddingAngle={3} dataKey="value">
                {CHART_DATA.certResults.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {CHART_DATA.certResults.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }}></span>
                  <span className="text-gray-400">{d.name}</span>
                </div>
                <span className="text-white font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Device Trust */}
        <div className="glass-card p-5">
          <div className="section-header mb-4">
            <Monitor size={16} className="text-cyan-400" />
            Device Trust Distribution
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CHART_DATA.deviceTrust} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={4}>
                {CHART_DATA.deviceTrust.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="glass-card p-5">
          <div className="section-header mb-4">
            <ShieldAlert size={16} className="text-orange-400" />
            Risk Distribution
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CHART_DATA.riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={4}>
                {CHART_DATA.riskDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-header mb-0">
            <Clock size={16} className="text-purple-400" />
            Recent Activity
          </div>
          <Link to="/audit" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="table-header text-left py-2 px-4">Timestamp</th>
                <th className="table-header text-left py-2 px-4">User</th>
                <th className="table-header text-left py-2 px-4">Action</th>
                <th className="table-header text-left py-2 px-4">Resource</th>
                <th className="table-header text-left py-2 px-4">Risk</th>
                <th className="table-header text-left py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(log => (
                <tr key={log.id} className="hover:bg-white/2 transition-colors">
                  <td className="table-cell font-mono text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString('en-IN', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-white text-xs">{log.user}</div>
                    <div className="text-xs text-gray-500">{log.role}</div>
                  </td>
                  <td className="table-cell">
                    <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded text-blue-300">{log.action}</code>
                  </td>
                  <td className="table-cell text-gray-400 text-xs">{log.resource}</td>
                  <td className="table-cell"><RiskBadge level={log.risk} /></td>
                  <td className="table-cell"><StatusBadge status={log.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active anomalies */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="section-header mb-0">
            <AlertTriangle size={16} className="text-red-400" />
            Active Anomalies
            <span className="ml-2 bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-2 py-0.5 rounded-full">
              {DEMO_ANOMALIES.filter(a => !a.resolved).length} unresolved
            </span>
          </div>
          <Link to="/anomalies" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {DEMO_ANOMALIES.filter(a => !a.resolved).map(a => (
            <div key={a.id} className="flex items-start justify-between p-3 bg-white/3 rounded-lg border border-white/5">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  a.riskLevel === 'Critical' ? 'bg-red-500 animate-pulse' :
                  a.riskLevel === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <div className="text-sm font-medium text-white">{a.type}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{a.details}</div>
                  <div className="text-xs text-gray-600 mt-1 font-mono">{new Date(a.timestamp).toLocaleString()}</div>
                </div>
              </div>
              <RiskBadge score={a.score} level={a.riskLevel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
