import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { BarChart3, TrendingUp, Shield, Award } from 'lucide-react'
import { CHART_DATA } from '../data/demoData'

const TOOLTIP_STYLE = {
  contentStyle: { background: '#0d1226', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#9ca3af' },
  itemStyle:  { color: '#e5e7eb' },
}

const MONTHLY_DATA = [
  { month: 'Oct', identities: 2, assets: 1, certs: 3, events: 8  },
  { month: 'Nov', identities: 3, assets: 2, certs: 4, events: 12 },
  { month: 'Dec', identities: 4, assets: 3, certs: 3, events: 15 },
  { month: 'Jan', identities: 5, assets: 4, certs: 5, events: 18 },
  { month: 'Feb', identities: 5, assets: 5, certs: 4, events: 22 },
  { month: 'Mar', identities: 5, assets: 5, certs: 5, events: 10 },
]

const RISK_TREND = [
  { week: 'W1', low: 5, medium: 3, high: 2, critical: 1 },
  { week: 'W2', low: 6, medium: 2, high: 3, critical: 0 },
  { week: 'W3', low: 4, medium: 4, high: 1, critical: 2 },
  { week: 'W4', low: 7, medium: 2, high: 2, critical: 1 },
]

const ASSET_TYPES = [
  { name: 'Training Cert', value: 1, color: '#3b82f6' },
  { name: 'Equipment License', value: 1, color: '#8b5cf6' },
  { name: 'Government Record', value: 1, color: '#f59e0b' },
  { name: 'Digital Cert', value: 1, color: '#06b6d4' },
  { name: 'Software License', value: 1, color: '#10b981' },
]

export default function Analytics() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Daily Events', value: '4.3', trend: '+12%', color: 'text-blue-400' },
          { label: 'Verification Rate', value: '80%', trend: '+5%', color: 'text-emerald-400' },
          { label: 'Avg Risk Score', value: '37/100', trend: '-8%', color: 'text-yellow-400' },
          { label: 'Blockchain Uptime', value: '100%', trend: '0%', color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            <div className={`text-xs mt-1 ${s.trend.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>{s.trend} this month</div>
          </div>
        ))}
      </div>

      {/* Monthly Overview */}
      <div className="glass-card p-5">
        <h3 className="section-header mb-4">
          <BarChart3 size={16} className="text-blue-400" />
          Monthly Platform Activity
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={MONTHLY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
            <Bar dataKey="identities" name="Identities" fill="#3b82f6" radius={[3,3,0,0]} />
            <Bar dataKey="assets" name="Assets" fill="#8b5cf6" radius={[3,3,0,0]} />
            <Bar dataKey="certs" name="Certs Verified" fill="#10b981" radius={[3,3,0,0]} />
            <Bar dataKey="events" name="Security Events" fill="#ef4444" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Risk trend */}
        <div className="glass-card p-5">
          <h3 className="section-header mb-4">
            <Shield size={16} className="text-orange-400" />
            Weekly Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={RISK_TREND}>
              <defs>
                {[['low','#10b981'],['medium','#f59e0b'],['high','#f97316'],['critical','#ef4444']].map(([k,c]) => (
                  <linearGradient key={k} id={`g_${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Area type="monotone" dataKey="low"      name="Low"      stroke="#10b981" fill="url(#g_low)"      strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="medium"   name="Medium"   stroke="#f59e0b" fill="url(#g_medium)"   strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="high"     name="High"     stroke="#f97316" fill="url(#g_high)"     strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" fill="url(#g_critical)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Asset distribution */}
        <div className="glass-card p-5">
          <h3 className="section-header mb-4">
            <Award size={16} className="text-purple-400" />
            Asset Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ASSET_TYPES} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={false} fontSize={10}>
                {ASSET_TYPES.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {ASSET_TYPES.map(a => (
              <div key={a.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }}></span>
                <span className="text-gray-400">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blockchain activity */}
      <div className="glass-card p-5">
        <h3 className="section-header mb-4">
          <TrendingUp size={16} className="text-cyan-400" />
          Blockchain Transaction Activity
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={CHART_DATA.blockchainTxByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="txns" name="Transactions" stroke="#06b6d4" strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
