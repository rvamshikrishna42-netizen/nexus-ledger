import React, { useState } from 'react'
import {
  Monitor, Shield, AlertTriangle, CheckCircle, XCircle,
  Eye, Trash2, MapPin, Clock, Wifi, Plus, Radio, Smartphone, Laptop, Key
} from 'lucide-react'
import { DEMO_DEVICES } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'
import { useTrustCore } from '../context/TrustCoreContext'

export default function Devices() {
  const { unknownDeviceDetected, toggleDeviceAlert } = useTrustCore()
  const [devices, setDevices] = useState(DEMO_DEVICES)
  const [search, setSearch] = useState('')

  const handleRevoke = (id) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Revoked', trustScore: 0, risk: 'High' } : d))
    )
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full ${
                unknownDeviceDetected ? 'bg-amber-400' : 'bg-emerald-400'
              } animate-pulse`}
            ></span>
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                unknownDeviceDetected ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              ENDPOINT TRUST MATRIX • 874 ATTESTED DEVICES
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Device Trust & Enclave Telemetry
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Hardware security enclaves, browser fingerprints, and attested defense workstations.
          </p>
        </div>

        {/* Ingress Detection Simulation Trigger */}
        <button
          onClick={toggleDeviceAlert}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-lg ${
            unknownDeviceDetected
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
              : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
          }`}
        >
          <Radio size={14} className={unknownDeviceDetected ? 'animate-pulse text-amber-400' : ''} />
          <span>{unknownDeviceDetected ? 'Clear Unknown Device Alert' : 'Simulate Unknown Device Ingress'}</span>
        </button>
      </div>

      {/* Floating 3D Device Cluster Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Trusted Workstation */}
        <div className="p-5 rounded-xl bg-[#070b18]/90 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Laptop size={16} />
              </div>
              <span className="text-xs font-bold text-white">Workstation Node</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              TRUSTED (GREEN)
            </span>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Hardware Enclave: Verified TPM 2.0</div>
            <div>Trust Score: 98/100</div>
          </div>
        </div>

        {/* Mobile Device */}
        <div
          className={`p-5 rounded-xl transition-colors border ${
            unknownDeviceDetected
              ? 'bg-amber-500/10 border-amber-500/40'
              : 'bg-[#070b18]/90 border-emerald-500/30'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  unknownDeviceDetected
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                }`}
              >
                <Smartphone size={16} />
              </div>
              <span className="text-xs font-bold text-white">Mobile Terminal</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                unknownDeviceDetected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {unknownDeviceDetected ? 'UNKNOWN (ORANGE ALERT)' : 'TRUSTED (GREEN)'}
            </span>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Hardware Enclave: {unknownDeviceDetected ? 'Pending Signature' : 'FIDO2 Enclave'}</div>
            <div>Trust Score: {unknownDeviceDetected ? '34/100 (Unverified)' : '92/100'}</div>
          </div>
        </div>

        {/* Hardware Security Token */}
        <div className="p-5 rounded-xl bg-[#070b18]/90 border border-cyan-500/30 hover:border-cyan-500/60 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Key size={16} />
              </div>
              <span className="text-xs font-bold text-white">FIDO2 Hardware Key</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
              ATTESTED (CYAN)
            </span>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Security Level: Level 3 HSM Enclave</div>
            <div>Trust Score: 100/100</div>
          </div>
        </div>
      </div>

      {/* Device Registry Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            All Registered Endpoint Nodes
          </div>
          <span className="text-xs text-gray-500">874 Active Devices</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#070b18]/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase">
              <tr>
                <th className="p-3.5">Device Name</th>
                <th className="p-3.5">OS / Platform</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Trust Score</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {devices.map((d) => (
                <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <Monitor size={14} className="text-gray-400" />
                    {d.name}
                  </td>
                  <td className="p-3.5 text-gray-400">{d.os}</td>
                  <td className="p-3.5 text-gray-300 font-mono">{d.ip}</td>
                  <td className="p-3.5 text-gray-400">{d.location}</td>
                  <td className="p-3.5">
                    <span className="text-emerald-400 font-bold">{d.trustScore}/100</span>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={d.status} />
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
