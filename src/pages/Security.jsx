import React, { useState } from 'react'
import {
  ShieldAlert, Shield, CheckCircle, AlertTriangle, XCircle,
  Fingerprint, Monitor, Award, Package, Lock, Link2,
  Zap, Activity, RefreshCw, ShieldOff, ShieldCheck, AlertOctagon
} from 'lucide-react'
import { useTrustCore } from '../context/TrustCoreContext'
import { useAuth } from '../context/AuthContext'
import { DEMO_SECURITY_EVENTS, DEMO_ANOMALIES } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import ExplainableSecurityAlert from '../components/ExplainableSecurityAlert'

const THREAT_FACTORS = [
  { name: 'Unknown Device', status: 'Monitored', risk: '+12%', desc: 'Hardware enclave attestation pending for new endpoint.' },
  { name: 'Unusual Location', status: 'Blocked', risk: '+04%', desc: 'Geo-IP ingress detected outside authorized defense zone.' },
  { name: 'Multiple Login Attempts', status: 'Rate Limited', risk: '+02%', desc: '3 failed authentication attempts detected from single IP.' },
  { name: 'Unusual Activity', status: 'Active Scan', risk: '+00%', desc: 'Off-hours cryptographic key query within tolerance.' },
]

const SECURITY_DOMAINS = [
  { label: 'Identity Security', score: 98, icon: Fingerprint, detail: '1,248 DIDs registered, 100% verified on blockchain' },
  { label: 'Device Security', score: 94, icon: Monitor, detail: '874 attested endpoints, 0 unauthorized connections' },
  { label: 'Certificate Integrity', score: 99, icon: Award, detail: '2,891 verified on-chain, instant SHA-256 matching' },
  { label: 'Asset Security', score: 96, icon: Package, detail: '3,542 digital assets anchored via sovereign NFT tokens' },
  { label: 'Access Control', score: 99, icon: Lock, detail: '5 RBAC roles enforced, 18 API permission gates' },
  { label: 'Blockchain Integrity', score: 100, icon: Link2, detail: 'Consensus healthy, 0 forks, 18,951+ blocks verified' },
]

// Roles allowed to control lockdown — Super Admin and Admin only
function canManageLockdown(role) {
  return role === 'Super Admin' || role === 'Admin'
}

export default function Security() {
  const {
    threatLevel,
    riskScore,
    anomaliesToday,
    simulateThreat,
    resetThreat,
    unknownDeviceDetected,
    lockdownStatus,
    lockdownActivatedBy,
    lockdownActivatedAt,
    activateLockdown,
    deactivateLockdown,
  } = useTrustCore()

  const { user, addAuditLog } = useAuth()

  const [permissionError, setPermissionError] = useState('')

  const isLockdownActive = lockdownStatus === 'active'
  const isLockdownTransitioning = lockdownStatus === 'activating' || lockdownStatus === 'deactivating'
  const isCritical = threatLevel === 'critical' || riskScore > 60
  const isElevated = threatLevel === 'elevated' || riskScore > 35

  const handleActivateLockdown = () => {
    setPermissionError('')
    if (!user) {
      setPermissionError('You must be logged in to perform this action.')
      return
    }
    if (!canManageLockdown(user.role)) {
      setPermissionError(
        `Access denied. Emergency Lockdown requires Super Admin or Admin role. Your current role is "${user.role}".`
      )
      return
    }
    activateLockdown(user)
    addAuditLog('EMERGENCY_LOCKDOWN_ACTIVATED', 'Security Center', 'Alert', 'Critical', user)
  }

  const handleDeactivateLockdown = () => {
    setPermissionError('')
    if (!user) {
      setPermissionError('You must be logged in to perform this action.')
      return
    }
    if (!canManageLockdown(user.role)) {
      setPermissionError(
        `Access denied. Only Super Admin or Admin can deactivate lockdown. Your current role is "${user.role}".`
      )
      return
    }
    deactivateLockdown()
    addAuditLog('EMERGENCY_LOCKDOWN_DEACTIVATED', 'Security Center', 'Success', 'High', user)
  }

  // Top 2 anomalies for the explainable alert panel
  const topAnomalies = DEMO_ANOMALIES.filter(a => !a.resolved).slice(0, 2)

  return (
    <div className="space-y-6">

      {/* ═══════════════════════════════════════════════════
          EMERGENCY LOCKDOWN CONTROL
      ═══════════════════════════════════════════════════ */}
      <div className={`rounded-2xl border transition-all duration-300 font-mono overflow-hidden ${
        isLockdownActive
          ? 'border-red-500/60 bg-red-950/30'
          : isLockdownTransitioning
          ? 'border-amber-500/40 bg-amber-950/20'
          : 'border-white/10 bg-[#070b18]/90'
      }`}>

        {/* Lockdown Active Banner */}
        {isLockdownActive && (
          <div className="bg-red-500/20 border-b border-red-500/40 px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertOctagon size={18} className="text-red-400 animate-pulse flex-shrink-0" />
              <div>
                <div className="text-sm font-black text-red-300 tracking-wider">
                  🚨 EMERGENCY LOCKDOWN ACTIVE
                </div>
                {lockdownActivatedBy && (
                  <div className="text-[10px] text-red-400/80 mt-0.5">
                    Activated by {lockdownActivatedBy}
                    {lockdownActivatedAt && ` • ${new Date(lockdownActivatedAt).toLocaleTimeString()}`}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-red-500/25 border border-red-500/50 text-red-300 font-bold animate-pulse">
              SYSTEM RESTRICTED
            </span>
          </div>
        )}

        {/* Transitioning Banner */}
        {isLockdownTransitioning && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-5 py-2.5 flex items-center gap-2">
            <RefreshCw size={13} className="text-amber-400 animate-spin" />
            <span className="text-xs text-amber-300 font-semibold">
              {lockdownStatus === 'activating' ? 'ACTIVATING LOCKDOWN…' : 'DEACTIVATING LOCKDOWN…'}
            </span>
          </div>
        )}

        <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          {/* Left: Status + Restrictions */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              {isLockdownActive
                ? <ShieldOff size={16} className="text-red-400" />
                : <ShieldCheck size={16} className="text-emerald-400" />
              }
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                EMERGENCY LOCKDOWN MODE
              </span>
            </div>

            {isLockdownActive ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-red-400">
                  <XCircle size={13} /> <span>Asset transfers blocked</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                  <XCircle size={13} /> <span>High-risk access blocked</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                  <XCircle size={13} /> <span>New device access restricted</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle size={13} /> <span>Admin approval required</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 col-span-2 sm:col-span-4">
                  <CheckCircle size={13} /> <span>Security event recorded in audit trail</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 max-w-xl">
                Emergency Lockdown immediately restricts asset transfers, high-risk access, and
                new device connections. Requires <strong className="text-gray-300">Super Admin</strong> or{' '}
                <strong className="text-gray-300">Admin</strong> role. All lockdown events are
                recorded in the immutable audit trail.
              </p>
            )}
          </div>

          {/* Right: Action Button */}
          <div className="flex flex-col gap-2 min-w-[220px]">
            {!isLockdownActive && !isLockdownTransitioning && (
              <button
                onClick={handleActivateLockdown}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/35 hover:border-red-400 transition-all font-semibold text-sm active:scale-95"
              >
                <ShieldOff size={16} />
                ACTIVATE EMERGENCY LOCKDOWN
              </button>
            )}

            {isLockdownActive && (
              <button
                onClick={handleDeactivateLockdown}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 transition-all font-semibold text-sm active:scale-95"
              >
                <ShieldCheck size={16} />
                DEACTIVATE LOCKDOWN
              </button>
            )}

            {isLockdownTransitioning && (
              <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm">
                <RefreshCw size={15} className="animate-spin" />
                <span>Processing…</span>
              </div>
            )}

            {permissionError && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                <XCircle size={13} className="flex-shrink-0 mt-0.5" />
                <span>{permissionError}</span>
              </div>
            )}

            {user && !canManageLockdown(user.role) && !permissionError && (
              <div className="text-[10px] text-gray-500 text-center">
                Logged in as <strong className="text-gray-400">{user.role}</strong> — lockdown control not permitted
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          AI Security Hero Banner
      ═══════════════════════════════════════════════════ */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 font-mono ${
        isCritical
          ? 'bg-red-500/10 border-red-500/30'
          : isElevated
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-[#070b18]/90 border-blue-500/20'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                isCritical ? 'bg-red-500' : isElevated ? 'bg-amber-400' : 'bg-emerald-400'
              } animate-pulse`}></span>
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                AI NEURAL SECURITY COMMAND • REAL-TIME SOC
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-2">
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">RISK SCORE</div>
                <div className={`text-3xl sm:text-4xl font-black mt-0.5 ${
                  isCritical ? 'text-red-400' : isElevated ? 'text-amber-400' : 'text-emerald-400'
                }`}>{riskScore}%</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">THREAT LEVEL</div>
                <div className={`text-2xl sm:text-3xl font-black mt-1 ${
                  isCritical ? 'text-red-400' : isElevated ? 'text-amber-400' : 'text-cyan-400'
                }`}>{threatLevel.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">ANOMALIES TODAY</div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">0{anomaliesToday}</div>
              </div>
            </div>

            <p className="text-xs text-gray-400 max-w-xl font-normal">
              Autonomous neural surveillance model evaluating continuous behavioral vectors,
              session telemetry, and cross-ledger transaction frequency.
            </p>
          </div>

          {/* 3D Simulator Panel */}
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

      {/* ═══════════════════════════════════════════════════
          EXPLAINABLE AI SECURITY ALERTS
      ═══════════════════════════════════════════════════ */}
      {topAnomalies.length > 0 && (
        <div>
          <div className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity size={14} className="text-amber-400" />
            Explainable Risk Analysis — Active Threats
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {topAnomalies.map(anomaly => (
              <ExplainableSecurityAlert
                key={anomaly.id}
                title={anomaly.type.toUpperCase()}
                riskScore={riskScore}
                threatLevel={threatLevel}
                unknownDeviceDetected={unknownDeviceDetected}
                anomaly={anomaly}
                lockdownStatus={lockdownStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          THREAT FACTORS MATRIX
      ═══════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════
          SECURITY DOMAINS BREAKDOWN
      ═══════════════════════════════════════════════════ */}
      <div>
        <div className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Cryptographic Domain Integrity Matrix
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECURITY_DOMAINS.map(({ label, score, icon: Icon, detail }) => (
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
