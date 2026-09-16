import React from 'react'
import {
  Maximize2, Minimize2, RotateCcw, ShieldCheck,
  AlertTriangle, Link2, Award, Zap, Radio, Layers
} from 'lucide-react'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function TrustCoreHUD({ inHero = false }) {
  const {
    activeModule,
    currentPreset,
    viewMode,
    setViewMode,
    verificationState,
    triggerVerification,
    threatLevel,
    riskScore,
    simulateThreat,
    resetThreat,
    emitTransaction,
    unknownDeviceDetected,
    toggleDeviceAlert,
    resetCamera,
    autoRotate,
    setAutoRotate,
  } = useTrustCore()

  if (inHero) {
    return (
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#0a0e1a]/85 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NEXUS TRUST CORE — ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerVerification(true)}
            className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-[11px]"
          >
            Scan Cert
          </button>
          <button
            onClick={() => emitTransaction()}
            className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-[11px]"
          >
            Emit Tx
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-x-3 top-3 flex flex-col pointer-events-none gap-2 z-10">
      {/* Top Bar Telemetry */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Module Status pill */}
        <div className="flex items-center gap-2.5 bg-[#0a0e1a]/90 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                threatLevel === 'critical'
                  ? 'bg-red-500'
                  : threatLevel === 'elevated'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              } animate-pulse`}
            ></span>
            <span className="text-[11px] font-mono font-semibold text-white tracking-wider uppercase">
              {currentPreset.label}
            </span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="text-[10px] font-mono text-gray-400">
            {currentPreset.id.toUpperCase()} • 60 FPS
          </span>
        </div>

        {/* View mode and controls */}
        <div className="flex items-center gap-1.5 bg-[#0a0e1a]/90 border border-white/10 p-1 rounded-lg backdrop-blur-md shadow-xl">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded text-xs transition-colors ${
              autoRotate ? 'text-blue-400 bg-blue-500/20' : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'full' ? 'docked' : 'full')}
            className="p-1.5 rounded text-gray-400 hover:text-white transition-colors"
            title={viewMode === 'full' ? 'Dock Viewport' : 'Fullscreen 3D View'}
          >
            {viewMode === 'full' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Floating Action HUD on bottom in full mode */}
      {viewMode === 'full' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0a0e1a]/90 border border-white/10 p-2 rounded-xl backdrop-blur-md shadow-2xl pointer-events-auto">
          <button
            onClick={() => triggerVerification(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs hover:bg-emerald-500/25 transition-all font-mono"
          >
            <Award size={14} />
            Verify Cert
          </button>
          <button
            onClick={() => triggerVerification(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs hover:bg-red-500/25 transition-all font-mono"
          >
            <AlertTriangle size={14} />
            Tamper Test
          </button>
          <button
            onClick={() => emitTransaction()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/25 transition-all font-mono"
          >
            <Link2 size={14} />
            Mine Block
          </button>
          <button
            onClick={() =>
              threatLevel === 'low'
                ? simulateThreat('elevated', 68)
                : threatLevel === 'elevated'
                ? simulateThreat('critical', 92)
                : resetThreat()
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all font-mono ${
              threatLevel === 'critical'
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : threatLevel === 'elevated'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Zap size={14} />
            Threat: {threatLevel.toUpperCase()}
          </button>
          <button
            onClick={toggleDeviceAlert}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all font-mono ${
              unknownDeviceDetected
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Radio size={14} />
            {unknownDeviceDetected ? 'Device Alert' : 'Normal Endpoint'}
          </button>
        </div>
      )}
    </div>
  )
}
