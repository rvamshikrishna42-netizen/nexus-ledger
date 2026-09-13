import { Bell, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import DemoBanner from './DemoBanner'

export default function Topbar({ title, subtitle }) {
  const { user, demoMode } = useAuth()

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-sm sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold text-white leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {demoMode && <DemoBanner />}

        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block"></span>
          SYSTEM SECURE
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {user?.avatar || 'U'}
        </div>
      </div>
    </header>
  )
}
