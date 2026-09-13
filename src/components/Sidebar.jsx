import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Fingerprint, Shield, Package, Award,
  Monitor, AlertTriangle, ShieldAlert, Link2, ClipboardList,
  BarChart3, Network, Cpu, Settings, LogOut, ChevronRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { group: 'Main', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { group: 'Identity & Access', items: [
    { to: '/identity', icon: Fingerprint, label: 'Identity Vault' },
    { to: '/rbac', icon: Shield, label: 'Access Control' },
  ]},
  { group: 'Assets', items: [
    { to: '/assets', icon: Package, label: 'Digital Assets' },
    { to: '/certificates', icon: Award, label: 'Certificates' },
  ]},
  { group: 'Security', items: [
    { to: '/devices', icon: Monitor, label: 'Device Trust' },
    { to: '/anomalies', icon: AlertTriangle, label: 'Anomaly Detection' },
    { to: '/security', icon: ShieldAlert, label: 'Security Center' },
  ]},
  { group: 'Blockchain & Audit', items: [
    { to: '/blockchain', icon: Link2, label: 'Blockchain Explorer' },
    { to: '/audit', icon: ClipboardList, label: 'Audit Trail' },
  ]},
  { group: 'Insights', items: [
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/architecture', icon: Network, label: 'Architecture' },
    { to: '/technologies', icon: Cpu, label: 'Technologies' },
  ]},
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth()

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } bg-[#0d1226] border-r border-white/5`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 min-h-[64px]">
        <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
            <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" stroke="white" strokeWidth="3" fill="none"/>
            <circle cx="32" cy="32" r="7" fill="white"/>
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-white text-sm leading-none">NEXUS LEDGER</div>
            <div className="text-[10px] text-blue-400 font-mono mt-0.5">v1.0 — BEL SIH 2024</div>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="mx-3 mt-3 p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-xs text-blue-400 truncate">{user.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map(group => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <div className="px-2 mb-1 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                {group.group}
              </div>
            )}
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150 group
                  ${isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/5 p-2 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all duration-150
            ${isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
          }
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={16} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ChevronRight size={14} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </aside>
  )
}
