import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Fingerprint, Package, Award, AlertTriangle, Monitor,
  ShieldAlert, Link2, TrendingUp, ArrowUpRight, ArrowRight,
  CheckCircle, XCircle, Clock, Activity, Zap, Radio, Shield, Terminal
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useTrustCore } from '../context/TrustCoreContext'
import {
  DASHBOARD_STATS, CHART_DATA, DEMO_AUDIT_LOGS,
  DEMO_ANOMALIES, DEMO_SECURITY_EVENTS, DEMO_BLOCKCHAIN_TXS, DEMO_DEVICES
} from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#070b18',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  labelStyle: { color: '#9ca3af' },
  itemStyle: { color: '#e5e7eb' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const {
    threatLevel,
    riskScore,
    triggerVerification,
    emitTransaction,
    simulateThreat,
    resetThreat,
  } = useTrustCore()

  const recent = DEMO_AUDIT_LOGS.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header Banner & Security Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              COMMAND CENTER • SOC ONLINE
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Security Operations Center
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Cryptographic telemetry synchronized with BEL defense enclave •{' '}
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Live Risk Score Badge */}
        <div className="flex items-center gap-4 bg-[#0a0f24]/90 border border-white/10 rounded-xl p-3 px-5 backdrop-blur-md">
          <div className="text-right font-mono">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">
              DYNAMIC RISK SCORE
            </div>
            <div className="text-2xl font-black text-white leading-tight mt-0.5 flex items-center justify-end gap-1.5">
              <span
                className={
                  threatLevel === 'critical'
                    ? 'text-red-400'
                    : threatLevel === 'elevated'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }
              >
                {riskScore}%
              </span>
              <span className="text-xs text-gray-500 font-normal">
                ({threatLevel.toUpperCase()})
              </span>
            </div>
          </div>
          <div
            className={`w-11 h-11 rounded-lg border flex items-center justify-center ${
              threatLevel === 'critical'
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : threatLevel === 'elevated'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            <Shield size={20} />
          </div>
        </div>
      </div>

      {/* Security Overview Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#070b18]/80 border border-white/5 rounded-xl p-3">
        <div className="flex items-center gap-3 px-3 py-1 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">IDENTITY</div>
            <div className="text-xs font-bold text-emerald-400">VERIFIED</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 font-mono border-l border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">AI ENGINE</div>
            <div className="text-xs font-bold text-cyan-400">ONLINE</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 font-mono border-l border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">BLOCKCHAIN</div>
            <div className="text-xs font-bold text-blue-400">CONNECTED</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 font-mono border-l border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">SECURITY</div>
            <div className="text-xs font-bold text-emerald-400">ACTIVE</div>
          </div>
        </div>
      </div>

      {/* 5 Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1,248 IDENTITIES */}
        <Link
          to="/identity"
          className="p-4 rounded-xl bg-white/[0.02] border border-blue-500/20 hover:border-blue-500/50 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Fingerprint size={16} />
            </div>
            <ArrowUpRight size={14} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-white">1,248</div>
          <div className="text-[11px] font-mono text-gray-400 mt-0.5">IDENTITIES</div>
        </Link>

        {/* 3,542 DIGITAL ASSETS */}
        <Link
          to="/assets"
          className="p-4 rounded-xl bg-white/[0.02] border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Package size={16} />
            </div>
            <ArrowUpRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-white">3,542</div>
          <div className="text-[11px] font-mono text-gray-400 mt-0.5">DIGITAL ASSETS</div>
        </Link>

        {/* 2,891 CERTIFICATES */}
        <Link
          to="/certificates"
          className="p-4 rounded-xl bg-white/[0.02] border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award size={16} />
            </div>
            <ArrowUpRight size={14} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-white">2,891</div>
          <div className="text-[11px] font-mono text-gray-400 mt-0.5">CERTIFICATES</div>
        </Link>

        {/* 874 TRUSTED DEVICES */}
        <Link
          to="/devices"
          className="p-4 rounded-xl bg-white/[0.02] border border-teal-500/20 hover:border-teal-500/50 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Monitor size={16} />
            </div>
            <ArrowUpRight size={14} className="text-gray-600 group-hover:text-teal-400 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-white">874</div>
          <div className="text-[11px] font-mono text-gray-400 mt-0.5">TRUSTED DEVICES</div>
        </Link>

        {/* 23 AI ALERTS */}
        <Link
          to="/security"
          className="p-4 rounded-xl bg-white/[0.02] border border-amber-500/20 hover:border-amber-500/50 transition-all duration-200 group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert size={16} />
            </div>
            <ArrowUpRight size={14} className="text-gray-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">23</div>
          <div className="text-[11px] font-mono text-gray-400 mt-0.5">AI ALERTS</div>
        </Link>
      </div>

      {/* Interactive 3D Tactical Action Bar */}
      <div className="p-3 bg-[#0a0f24]/90 border border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-gray-300">
          <Terminal size={14} className="text-blue-400" />
          <span>3D TRUST CORE DISPATCH:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerVerification(true)}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all text-[11px]"
          >
            ⚡ Scan Certificate
          </button>
          <button
            onClick={() => emitTransaction()}
            className="px-2.5 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 transition-all text-[11px]"
          >
            ⚡ Mine Block Tx
          </button>
          <button
            onClick={() =>
              threatLevel === 'low'
                ? simulateThreat('elevated', 68)
                : threatLevel === 'elevated'
                ? simulateThreat('critical', 92)
                : resetThreat()
            }
            className="px-2.5 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all text-[11px]"
          >
            ⚡ Neural Scan Pulse
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Security Events Trend */}
        <div className="md:col-span-2 p-5 rounded-xl bg-[#070b18]/90 border border-white/5">
          <div className="flex items-center justify-between mb-4 font-mono">
            <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
              <Activity size={15} className="text-blue-400" />
              <span>Telemetry Events — Last 7 Days</span>
            </div>
            <span className="text-[10px] text-gray-500">24H ROLLING WINDOW</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={CHART_DATA.securityEvents}>
              <defs>
                <linearGradient id="evtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', color: '#9ca3af' }} />
              <Area type="monotone" dataKey="events" name="All Events" stroke="#3b82f6" fill="url(#evtGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" fill="url(#critGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Certificate Verification Status */}
        <div className="p-5 rounded-xl bg-[#070b18]/90 border border-white/5">
          <div className="flex items-center justify-between mb-4 font-mono">
            <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
              <Award size={15} className="text-emerald-400" />
              <span>Certificate Audit Status</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={CHART_DATA.certResults}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {CHART_DATA.certResults.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row: Recent Activity & Security Alerts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Activity Audit */}
        <div className="p-5 rounded-xl bg-[#070b18]/90 border border-white/5 font-mono">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
              <Clock size={15} className="text-blue-400" />
              <span>Recent Immutable Audit Logs</span>
            </div>
            <Link to="/audit" className="text-[10px] text-blue-400 hover:underline">
              VIEW FULL LEDGER →
            </Link>
          </div>

          <div className="space-y-2">
            {recent.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                  <div className="truncate">
                    <div className="text-white font-medium truncate">{log.action}</div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {log.user} • {(log.txHash || '').substring(0, 14)}...
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <StatusBadge status={log.status} />
                  <div className="text-[9px] text-gray-500 mt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Alerts & Device Status */}
        <div className="p-5 rounded-xl bg-[#070b18]/90 border border-white/5 font-mono">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
              <ShieldAlert size={15} className="text-amber-400" />
              <span>Live Threat Alerts</span>
            </div>
            <Link to="/security" className="text-[10px] text-blue-400 hover:underline">
              SOC VIEW →
            </Link>
          </div>

          <div className="space-y-2">
            {DEMO_SECURITY_EVENTS.slice(0, 4).map((evt) => (
              <div
                key={evt.id}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="min-w-0">
                  <div className="text-white font-medium truncate flex items-center gap-2">
                    <span>{evt.type}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      {evt.severity}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">
                    Source: {evt.ip} • {evt.source}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-[10px] text-amber-400 font-semibold">{evt.status}</span>
                  <div className="text-[9px] text-gray-500 mt-0.5">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
