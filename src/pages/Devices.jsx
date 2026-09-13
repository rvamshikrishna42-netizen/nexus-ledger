import { useState } from 'react'
import {
  Monitor, Shield, AlertTriangle, CheckCircle, XCircle,
  Eye, Trash2, MapPin, Clock, Wifi, Plus
} from 'lucide-react'
import { DEMO_DEVICES } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'

function TrustBar({ score }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-yellow-500' : score >= 20 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      <span className={`text-xs font-bold ${score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-yellow-400' : score >= 20 ? 'text-orange-400' : 'text-red-400'}`}>
        {score}
      </span>
    </div>
  )
}

function DeviceModal({ device, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Monitor size={16} className="text-cyan-400" /> Device Details
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><XCircle size={18} /></button>
        </div>

        {/* Trust score visual */}
        <div className="text-center mb-5 py-4 bg-white/3 rounded-xl">
          <div className={`text-4xl font-black ${device.trustScore >= 80 ? 'text-emerald-400' : device.trustScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {device.trustScore}
          </div>
          <div className="text-xs text-gray-500 mt-1">Trust Score / 100</div>
          <div className="mt-2 h-2 w-32 mx-auto bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${device.trustScore >= 80 ? 'bg-emerald-500' : device.trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${device.trustScore}%` }}></div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {[
            { label: 'Device ID', value: device.id, mono: true },
            { label: 'Name', value: device.name },
            { label: 'Browser', value: device.browser },
            { label: 'OS', value: device.os },
            { label: 'IP Address', value: device.ip, mono: true },
            { label: 'Location', value: device.location },
            { label: 'First Seen', value: new Date(device.firstSeen).toLocaleString() },
            { label: 'Last Seen', value: new Date(device.lastSeen).toLocaleString() },
            { label: 'Fingerprint', value: device.fingerprint, mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className="text-gray-500">{label}</span>
              <span className={`text-gray-200 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={device.status} />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-500">Risk</span>
            <RiskBadge level={device.risk} />
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-600 bg-white/3 rounded-lg p-3">
          <strong className="text-gray-400">Privacy Note:</strong> Device identification is pseudonymous using browser fingerprinting.
          This does not uniquely or permanently identify physical hardware across all contexts.
        </div>
        <button onClick={onClose} className="btn-primary w-full justify-center mt-4">Close</button>
      </div>
    </div>
  )
}

export default function Devices() {
  const [devices, setDevices] = useState(DEMO_DEVICES)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = devices.filter(d => {
    const matchFilter = filter === 'All' || d.status === filter
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ip.includes(search) || d.location.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleRevoke = (id) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: 'Revoked', trustScore: 0, risk: 'High' } : d))
  }

  const handleTrust = (id) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: 'Known', trustScore: 85, risk: 'Low' } : d))
  }

  const stats = {
    total: devices.length,
    known: devices.filter(d => d.status === 'Known').length,
    suspicious: devices.filter(d => d.status === 'Suspicious').length,
    revoked: devices.filter(d => d.status === 'Revoked').length,
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Devices', value: stats.total, color: 'text-cyan-400' },
          { label: 'Known & Trusted', value: stats.known, color: 'text-emerald-400' },
          { label: 'Suspicious', value: stats.suspicious, color: 'text-red-400' },
          { label: 'Revoked', value: stats.revoked, color: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input className="input-field w-56" placeholder="Search devices..." value={search} onChange={e => setSearch(e.target.value)} />
        {['All', 'Known', 'New', 'Suspicious', 'Revoked'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filter === f
              ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
              : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Alert for suspicious */}
      {devices.some(d => d.status === 'Suspicious') && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-400">Suspicious Device Detected</div>
            <div className="text-xs text-red-300/70 mt-0.5">
              1 device with TOR Browser detected from unknown location. Consider revoking access immediately.
            </div>
          </div>
        </div>
      )}

      {/* Device table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5 bg-white/2">
              <tr>
                {['Device', 'Browser / OS', 'IP & Location', 'Last Seen', 'Trust Score', 'Risk', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(device => (
                <tr key={device.id} className="hover:bg-white/2 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        device.status === 'Suspicious' ? 'bg-red-500/10' : 'bg-cyan-500/10'
                      }`}>
                        <Monitor size={14} className={device.status === 'Suspicious' ? 'text-red-400' : 'text-cyan-400'} />
                      </div>
                      <div>
                        <div className="text-sm text-white">{device.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{device.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-300">{device.browser}</div>
                    <div className="text-xs text-gray-500">{device.os}</div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1 text-sm font-mono text-gray-300">
                      <Wifi size={12} className="text-gray-500" />{device.ip}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin size={10} />{device.location}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-xs text-gray-400 font-mono">
                      {new Date(device.lastSeen).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(device.lastSeen).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="table-cell"><TrustBar score={device.trustScore} /></td>
                  <td className="table-cell"><RiskBadge level={device.risk} /></td>
                  <td className="table-cell"><StatusBadge status={device.status} /></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(device)}
                        className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      {(device.status === 'New' || device.status === 'Suspicious') && (
                        <button onClick={() => handleTrust(device.id)}
                          className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors" title="Trust">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {device.status !== 'Revoked' && (
                        <button onClick={() => handleRevoke(device.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Revoke">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Monitor size={32} className="mx-auto mb-3 opacity-30" />
            No devices found.
          </div>
        )}
      </div>

      {/* Privacy note */}
      <div className="glass-card p-4 bg-blue-500/5 border-blue-500/15">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-blue-300">Pseudonymous Device Identification:</strong> Devices are identified using browser fingerprinting
            (user agent, timezone, screen properties). This creates a probabilistic pseudonym for session continuity and anomaly detection.
            It does not claim permanent or unique physical hardware identification.
          </div>
        </div>
      </div>

      {selected && <DeviceModal device={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
