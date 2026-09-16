import React, { useState } from 'react'
import {
  ClipboardList, Search, Download, ShieldCheck, Filter, Clock, Hash, Fingerprint, Plus
} from 'lucide-react'
import { DEMO_AUDIT_LOGS } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import { useTrustCore } from '../context/TrustCoreContext'

export default function Audit() {
  const { activeModule, setActiveModule } = useTrustCore()
  const [logs, setLogs] = useState(DEMO_AUDIT_LOGS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  // Generate DID for each log based on user
  const getDid = (user) => {
    if (user.includes('Arjun')) return 'did:nexus:7a82e4f9...'
    if (user.includes('Priya')) return 'did:nexus:3c9e1b7a...'
    if (user.includes('Rahul')) return 'did:nexus:7d2f4b6a...'
    if (user.includes('System')) return 'did:nexus:sys00000...'
    return 'did:nexus:2a4c6e8f...'
  }

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.txHash.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || log.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">
              HOLOGRAPHIC IMMUTABLE AUDIT LEDGER
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Cryptographic Audit Trail
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Tamper-proof event logs anchored to consensus blocks with non-repudiation seals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck size={13} />
            IMMUTABLE LEDGER SEALED
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-[#070b18]/90 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="Search User, Action, Tx Hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[11px]">STATUS:</span>
          {['All', 'Success', 'Failed', 'Alert'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg border text-[10px] transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 font-bold'
                  : 'border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Trail Table - Exact specified columns: USER, ACTION, TIMESTAMP, DID, TRANSACTION HASH, STATUS */}
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#070b18]/90">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="p-3.5">USER</th>
              <th className="p-3.5">ACTION</th>
              <th className="p-3.5">TIMESTAMP</th>
              <th className="p-3.5">DID</th>
              <th className="p-3.5">TRANSACTION HASH</th>
              <th className="p-3.5">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((entry, idx) => (
              <tr
                key={entry.id}
                className="hover:bg-white/[0.02] transition-colors group animate-fadeIn"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* USER */}
                <td className="p-3.5 font-bold text-white whitespace-nowrap">
                  {entry.user}
                </td>

                {/* ACTION */}
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 text-[11px]">
                    {entry.action}
                  </span>
                </td>

                {/* TIMESTAMP */}
                <td className="p-3.5 text-gray-400 whitespace-nowrap text-[11px]">
                  {new Date(entry.timestamp).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  •{' '}
                  {new Date(entry.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>

                {/* DID */}
                <td className="p-3.5 text-cyan-400 font-mono whitespace-nowrap">
                  {getDid(entry.user)}
                </td>

                {/* TRANSACTION HASH */}
                <td className="p-3.5 font-mono text-indigo-300 truncate max-w-[160px]" title={entry.txHash}>
                  {entry.txHash}
                </td>

                {/* STATUS */}
                <td className="p-3.5">
                  <StatusBadge status={entry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
