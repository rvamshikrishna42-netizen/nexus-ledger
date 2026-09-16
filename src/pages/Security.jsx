import React, { useState } from 'react'
import {
  ShieldAlert, Shield, CheckCircle, AlertTriangle, XCircle,
  Fingerprint, Monitor, Award, Package, Lock, Link2,
  TrendingUp, Bell, Clock, Zap, Activity, Radio, Cpu, RefreshCw
} from 'lucide-react'
import { useTrustCore } from '../context/TrustCoreContext'
import { DEMO_SECURITY_EVENTS, DEMO_ANOMALIES } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'

const THREAT_FACTORS = [
  { name: 'Unknown Device', status: 'Monitored', risk: '+12%', desc: 'Hardware enclave attestation pending for new endpoint.' },
  { name: 'Unusual Location', status: 'Blocked', risk: '+04%', desc: 'Geo-IP ingress detected outside authorized defense zone.' },
  { name: 'Multiple Login Attempts', status: 'Rate Limited', risk: '+02%', desc: '3 failed authentication attempts detected from single IP.' },
  { name: 'Unusual Activity', status: 'Active Scan', risk: '+00%', desc: 'Off-hours cryptographic key query within tolerance.' },
]

const SECURITY_DOMAINS = [
  { label: 'Identity Security', score: 98, icon: Fingerprint, color: 'blue', detail: '1,248 DIDs registered, 100% verified on blockchain' },
  { label: 'Device Security', score: 94, icon: Monitor, color: 'cyan', detail: '874 attested endpoints, 0 unauthorized connections' },
  { label: 'Certificate Integrity', score: 99, icon: Award, color: 'green', detail: '2,891 verified on-chain, instant SHA-256 matching' },
  { label: 'Asset Security', score: 96, icon: Package, color: 'purple', detail: '3,542 digital assets anchored via sovereign NFT tokens' },
  { label: 'Access Control', score: 99, icon: Lock, color: 'orange', detail: '5 RBAC roles enforced, 18 API permission gates' },
  { label: 'Blockchain Integrity', score: 100, icon: Link2, color: 'indigo', detail: 'Consensus healthy, 0 forks, 18,951+ blocks verified' },
]

export default function Security() {
  const {
    threatLevel,
    riskScore,
    anomaliesToday,
    simulateThreat,
    resetThreat,
  } = useTrustCore()

  const [dismissedAlerts, setDismissedAlerts] = useState([])

  const isCritical = threatLevel === 'critical' || riskScore > 60
  const isElevated = threatLevel === 'elevated' || riskScore > 35

  return (
    <div className="space-y-6">
      {/* AI Security Hero Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all duration-300 font-mono ${
          isCritical
            ? 'bg-red-500/10 border-red-500/30'
            : isElevated
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-[#070b18]/90 border-blue-500/20'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isCritical
                    ? 'bg-red-500'
                    : isElevated
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                } animate-pulse`}
              ></span>
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                AI NEURAL SECURITY COMMAND • REAL-TIME SOC
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-2">
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                  RISK SCORE
                </div>
                <div
                  className={`text-3xl sm:text-4xl font-black mt-0.5 ${
                    isCritical
                      ? 'text-red-400'
                      : isElevated
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {riskScore}%
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                  THREAT LEVEL
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-black mt-1 ${
                    isCritical
                      ? 'text-red-400'
                      : isElevated
                      ? 'text-amber-400'
                      : 'text-cyan-400'
                  }`}
                >
                  {threatLevel.toUpperCase()}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                  ANOMALIES TODAY
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  0{anomaliesToday}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 max-w-xl font-normal">
              Autonomous neural surveillance model evaluating continuous behavioral vectors,
              session telemetry, and cross-ledger transaction frequency.
            </p>
          </div>

          {/* Interactive 3D Simulator Trigger Panel */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 min-w-[260px]">
            <div className="text-[11px] font-semibold text-gray-300 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              <span>3D AI CORE SIMULATION</span>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => simulateThreat('critical', 88)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                  isCritical
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <span>Trigger Critical Threat</span>
                <span className="text-[10px] text-red-400">88%</span>
              </button>

              <button
                onClick={() => simulateThreat('elevated', 52)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                  isElevated && !isCritical
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <span>Trigger Elevated Risk</span>
                <span className="text-[10px] text-amber-400">52%</span>
              </button>

              <button
                onClick={resetThreat}
                className="w-full text-left px-3 py-2 rounded-lg text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center justify-between"
              >
                <span>Reset Baseline (Low Risk)</span>
                <span className="text-[10px] text-emerald-400">18%</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Factors Matrix */}
      <div>
        <div className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Active Threat Evaluation Factors
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {THREAT_FACTORS.map((factor) => (
            <div key={factor.name} className="p-4 rounded-xl bg-[#070b18]/90 border border-white/5 font-mono">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-white">{factor.name}</div>
                <span className="text-[10px] text-emerald-400">{factor.risk}</span>
              </div>
              <div className="text-[10px] text-gray-500 mb-3">{factor.desc}</div>
              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/5">
                <span className="text-gray-400">Status:</span>
                <span className="text-blue-400 font-semibold">{factor.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Domains Breakdown */}
      <div>
        <div className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Cryptographic Domain Integrity Matrix
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECURITY_DOMAINS.map(({ label, score, icon: Icon, color, detail }) => (
            <div key={label} className="p-4 rounded-xl bg-[#070b18]/90 border border-white/5 font-mono">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-bold text-white">{label}</span>
                </div>
                <span className="text-sm font-black text-emerald-400">{score}%</span>
              </div>
              <p className="text-[11px] text-gray-400">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
