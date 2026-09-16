import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTrustCore } from '../context/TrustCoreContext'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import TrustCoreCanvas from './trust-core/TrustCoreCanvas'
import { Maximize2, Minimize2, Eye, Compass, ShieldCheck } from 'lucide-react'

export default function Layout({ title, subtitle }) {
  const { user, loading } = useAuth()
  const { viewMode, setViewMode, activeModule, currentPreset } = useTrustCore()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-gray-400 text-sm">Loading Nexus Ledger...</div>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex bg-[#0a0e1a] text-gray-100 overflow-hidden">
      {/* Persistent Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Topbar title={title} subtitle={subtitle} />

        {/* Workspace Body */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Page Content Pane */}
          <main
            key={location.pathname}
            className={`flex-1 overflow-y-auto p-6 transition-all duration-500 ease-out animate-fadeIn ${
              viewMode === 'full' ? 'hidden' : 'block'
            }`}
          >
            <Outlet />
          </main>

          {/* Persistent 3D Digital Trust Core Deck */}
          <div
            className={`transition-all duration-500 ease-out ${
              viewMode === 'full'
                ? 'absolute inset-0 z-30 flex flex-col'
                : 'hidden xl:flex xl:w-[460px] 2xl:w-[540px] flex-col border-l border-white/5 bg-[#070b18]/60 relative'
            }`}
          >
            {/* Header Telemetry Strip */}
            <div className="h-10 px-4 bg-[#0a0f24]/90 border-b border-white/5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-gray-300 font-semibold tracking-wider uppercase text-[10px]">
                  3D TRUST CORE
                </span>
                <span className="text-blue-400 text-[10px]">
                  [{currentPreset.label}]
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'full' ? 'docked' : 'full')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-[10px]"
                  title={viewMode === 'full' ? 'Dock to split view' : 'Expand full screen'}
                >
                  {viewMode === 'full' ? (
                    <>
                      <Minimize2 size={11} />
                      <span>Dock</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 size={11} />
                      <span>Expand 3D</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Persistent 3D WebGL Canvas */}
            <div className="flex-1 relative min-h-[400px]">
              <TrustCoreCanvas />
            </div>

            {/* Contextual Quick Info Footer */}
            {viewMode !== 'full' && (
              <div className="px-4 py-2.5 bg-[#0a0f24]/90 border-t border-white/5 text-[11px] font-mono text-gray-400 flex items-center justify-between">
                <span className="truncate max-w-[260px] text-gray-400">
                  {currentPreset.description}
                </span>
                <span className="text-emerald-400/80 text-[10px] uppercase tracking-wider">
                  PERSISTENT
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
