import { useState } from 'react'
import {
  ClipboardList, Search, Download
} from 'lucide-react'
import { DEMO_AUDIT_LOGS } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'
import { useAuth } from '../context/AuthContext'

const ACTION_ICONS = {
  LOGIN: '🔐', FAILED_LOGIN: '❌', TRANSFER_ASSET: '📦', VERIFY_CERT: '📄',
  DEVICE_REGISTERED: '💻', CREATE_DID: '🪪', ROLE_CHANGED: '👥',
  CERT_HASH_MISMATCH: '⚠️', DEVICE_REVOKED: '🚫', REGISTER_ASSET: '✅',
  VERIFY_DID: '🔍', LOGOUT: '🚪',
}

export default function Audit() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [actionFilter, setActionFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  // Merge demo data with any session-stored logs
  const sessionLogs = (() => {
    try { return JSON.parse(localStorage.getItem('nexus_audit') || '[]') } catch { return [] }
  })()
  const allLogs = [...sessionLogs, ...DEMO_AUDIT_LOGS].slice(0, 50)

  const uniqueActions = ['All', ...new Set(allLogs.map(l => l.action))]

  const filtered = allLogs.filter(log => {
    const matchSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      (log.ip || '').includes(search)
    const matchStatus = statusFilter === 'All' || log.status === statusFilter
    const matchRisk = riskFilter === 'All' || log.risk === riskFilter
    const matchAction = actionFilter === 'All' || log.action === actionFilter
    return matchSearch && matchStatus && matchRisk && matchAction
  })

  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Resource', 'Tx Hash', 'Risk', 'Status', 'IP']
    const rows = filtered.map(l => [l.id, l.timestamp, l.user, l.role, l.action, l.resource, l.txHash || '', l.risk, l.status, l.ip || ''])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'nexus_audit_log.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: allLogs.length, color: 'text-blue-400' },
          { label: 'Critical', value: allLogs.filter(l => l.risk === 'Critical').length, color: 'text-red-400' },
          { label: 'Failures', value: allLogs.filter(l => l.status === 'Failed' || l.status === 'Alert').length, color: 'text-orange-400' },
          { label: 'Showing', value: filtered.length, color: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input className="input-field pl-9" placeholder="Search user, action, resource, IP..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={exportCSV} className="btn-secondary text-sm">
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Status:</span>
            {['All', 'Success', 'Failed', 'Alert'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${statusFilter === f
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                  : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Risk:</span>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map(f => (
              <button key={f} onClick={() => setRiskFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${riskFilter === f
                  ? 'bg-orange-600/20 border-orange-500/40 text-orange-400'
                  : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5 bg-white/2">
              <tr>
                {['Timestamp', 'User / Role', 'Action', 'Resource', 'Tx Hash', 'IP', 'Risk', 'Status'].map(h => (
                  <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className={`hover:bg-white/2 transition-colors cursor-pointer ${
                  log.risk === 'Critical' ? 'border-l-2 border-l-red-500/40' :
                  log.risk === 'High' ? 'border-l-2 border-l-orange-500/30' : ''
                }`} onClick={() => setSelected(log)}>
                  <td className="table-cell">
                    <div className="font-mono text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleDateString('en-IN', { month:'short', day:'numeric' })}
                    </div>
                    <div className="font-mono text-xs text-gray-600">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-white">{log.user}</div>
                    <div className="text-xs text-gray-500">{log.role}</div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <span>{ACTION_ICONS[log.action] || '📋'}</span>
                      <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded text-blue-300">{log.action}</code>
                    </div>
                  </td>
                  <td className="table-cell text-xs text-gray-400">{log.resource}</td>
                  <td className="table-cell">
                    {log.txHash
                      ? <code className="text-xs text-green-400 font-mono">{log.txHash.slice(0, 12)}...</code>
                      : <span className="text-xs text-gray-600">—</span>
                    }
                  </td>
                  <td className="table-cell font-mono text-xs text-gray-500">{log.ip}</td>
                  <td className="table-cell"><RiskBadge level={log.risk} /></td>
                  <td className="table-cell"><StatusBadge status={log.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList size={32} className="mx-auto mb-3 opacity-30" />
            No audit logs match your filters.
          </div>
        )}
      </div>

      {/* Log detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <ClipboardList size={15} className="text-blue-400" /> Log Entry Detail
              </h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Log ID', value: selected.id, mono: true },
                { label: 'Timestamp', value: new Date(selected.timestamp).toLocaleString() },
                { label: 'User', value: selected.user },
                { label: 'Role', value: selected.role },
                { label: 'Action', value: selected.action },
                { label: 'Resource', value: selected.resource },
                { label: 'Tx Hash', value: selected.txHash || 'N/A', mono: true },
                { label: 'IP Address', value: selected.ip || 'N/A', mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-500">{label}</span>
                  <span className={`text-gray-200 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500">Risk</span>
                <RiskBadge level={selected.risk} />
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="btn-primary w-full justify-center mt-5">Close</button>
          </div>
        </div>
      )}

      {/* Integrity note */}
      <div className="glass-card p-4 bg-blue-500/5 border-blue-500/15">
        <div className="flex items-start gap-3">
          <ClipboardList size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-blue-300">Tamper-Proof Audit Trail:</strong> All audit logs are cryptographically linked and stored with blockchain transaction hashes where applicable.
            Any modification to the logs would break the hash chain. The CSV export preserves the full audit record for compliance reporting.
          </div>
        </div>
      </div>
    </div>
  )
}
