import React, { useState } from 'react'
import {
  AlertTriangle, CheckCircle, XCircle, Eye, Shield,
  TrendingUp, Clock, Filter, RefreshCw, Zap, Radio, Activity
} from 'lucide-react'
import { DEMO_ANOMALIES } from '../data/demoData'
import RiskBadge from '../components/RiskBadge'
import StatusBadge from '../components/StatusBadge'
import { useTrustCore } from '../context/TrustCoreContext'
import ExplainableSecurityAlert from '../components/ExplainableSecurityAlert'

const RULES = [
  { id: 'BRUTE_FORCE_DETECTED', label: 'Brute Force Detection', desc: 'Triggers when >10 failed logins in 5 minutes from same IP', color: 'red' },
  { id: 'OFF_HOURS_ACTIVITY', label: 'Off-Hours Activity', desc: 'Flags activity between 10 PM and 6 AM local time', color: 'orange' },
  { id: 'NEW_DEVICE_DETECTED', label: 'New Device Login', desc: 'Detected when user logs in from a previously unseen device', color: 'yellow' },
  { id: 'CERT_TAMPERING_DETECTED', label: 'Certificate Tampering', desc: 'SHA-256 hash mismatch detected against blockchain record', color: 'red' },
  { id: 'IP_CHANGE_DETECTED', label: 'IP Address Change', desc: 'User authenticates from a different IP than usual', color: 'blue' },
  { id: 'DID_VERIFY_FAILURE', label: 'DID Verification Failure', desc: 'DID verification failed 3+ times — possible spoofing attempt', color: 'purple' },
]

export default function Anomalies() {
  const { threatLevel, riskScore, simulateThreat, resetThreat, unknownDeviceDetected, lockdownStatus } = useTrustCore()
  const [anomalies, setAnomalies] = useState(DEMO_ANOMALIES)
  const [filter, setFilter] = useState('All')

  // Highest-scoring unresolved anomaly for explainable alert panel
  const topAnomaly = [...anomalies]
    .filter(a => !a.resolved)
    .sort((a, b) => b.score - a.score)[0] ?? null

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              RULE-BASED ANOMALY DETECTION & NEURAL VECTORS
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Behavioral Anomaly Engine
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Continuous threat vector analysis correlating session entropy and credential movements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateThreat('elevated', 65)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
          >
            <Activity size={13} />
            Emit Anomaly Pulse
          </button>
        </div>
      </div>

      {/* AI Network Scanning Telemetry Strip */}
      <div className="p-4 rounded-xl bg-[#070b18]/90 border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>AI SCANNING RADAR: ACTIVE</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PULSING
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Current Risk: {riskScore}% • Threat: {threatLevel.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-400">
          <div>
            <div className="text-[10px] text-gray-500">SURVEILLANCE FREQUENCY</div>
            <div className="text-white font-bold">120 Hz Continuous</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500">EVALUATED NODES</div>
            <div className="text-cyan-400 font-bold">874 Endpoints</div>
          </div>
        </div>
      </div>

      {/* Explainable AI Alert — top unresolved anomaly */}
      {topAnomaly && (
        <ExplainableSecurityAlert
          title={topAnomaly.type.toUpperCase()}
          riskScore={riskScore}
          threatLevel={threatLevel}
          unknownDeviceDetected={unknownDeviceDetected}
          anomaly={topAnomaly}
          lockdownStatus={lockdownStatus}
        />
      )}

      {/* Anomaly Detection Rules */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Heuristic Anomaly Vectors
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RULES.map((rule) => (
            <div key={rule.id} className="p-4 rounded-xl bg-[#070b18]/90 border border-white/5">
              <div className="text-xs font-bold text-white mb-1">{rule.label}</div>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{rule.desc}</p>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Rule Active
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Detected Anomalies Stream
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#070b18]/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase">
              <tr>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Rule ID</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {anomalies.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                    <span>{a.type}</span>
                  </td>
                  <td className="p-3.5 text-gray-300">{a.user}</td>
                  <td className="p-3.5 font-mono text-gray-400">{a.rule}</td>
                  <td className="p-3.5">
                    <span className="text-amber-400 font-bold">{a.score}/100</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {a.resolved ? 'RESOLVED' : 'ACTIVE INVESTIGATION'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
