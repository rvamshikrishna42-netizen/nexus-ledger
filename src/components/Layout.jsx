import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({ title, subtitle }) {
  const { user, loading } = useAuth()
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
            className="flex-1 overflow-y-auto p-6 animate-fadeIn"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
