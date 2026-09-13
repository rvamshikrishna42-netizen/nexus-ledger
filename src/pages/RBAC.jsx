import React, { useState } from 'react'
import { Shield, CheckCircle, XCircle, Info, Lock, Unlock, Users } from 'lucide-react'
import { RBAC_MATRIX } from '../data/demoData'
import { useAuth } from '../context/AuthContext'

const ROLE_COLORS = {
  'Super Admin': 'text-red-400 bg-red-500/10 border-red-500/20',
  'Admin':       'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Manager':     'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Auditor':     'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'User':        'text-gray-400 bg-gray-500/10 border-gray-500/20',
}

const CATEGORY_COLORS = {
  Identity:    'text-blue-400',
  Assets:      'text-purple-400',
  Certificates:'text-green-400',
  Audit:       'text-yellow-400',
  Admin:       'text-red-400',
  Security:    'text-orange-400',
  Blockchain:  'text-cyan-400',
}

const DEMO_USERS_RBAC = [
  { id: 1, name: 'Arjun Sharma',  email: 'admin@nexusledger.demo',   role: 'Super Admin', status: 'Active' },
  { id: 2, name: 'Priya Nair',    email: 'user@nexusledger.demo',    role: 'User',        status: 'Active' },
  { id: 3, name: 'Rahul Verma',   email: 'auditor@nexusledger.demo', role: 'Auditor',     status: 'Active' },
  { id: 4, name: 'Sneha Kapoor',  email: 'manager@nexusledger.demo', role: 'Manager',     status: 'Active' },
  { id: 5, name: 'Vikram Singh',  email: 'vikram@nexusledger.demo',  role: 'User',        status: 'Inactive' },
]

const categories = [...new Set(RBAC_MATRIX.permissions.map(p => p.category))]

export default function RBAC() {
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = useState('Super Admin')
  const [users, setUsers] = useState(DEMO_USERS_RBAC)
  const [tab, setTab] = useState('matrix')
  const [editingUser, setEditingUser] = useState(null)
  const [newRole, setNewRole] = useState('')

  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin'

  const handleRoleChange = (userId, role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
    setEditingUser(null)
  }

  const permCount = (role) =>
    Object.values(RBAC_MATRIX.matrix[role] || {}).filter(Boolean).length

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-3">
        {['matrix', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-lg transition-all capitalize ${
              tab === t ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {t === 'matrix' ? '🔐 Permission Matrix' : '👥 User Roles'}
          </button>
        ))}
      </div>

      {tab === 'matrix' && (
        <>
          {/* Role summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {RBAC_MATRIX.roles.map(role => (
              <button key={role} onClick={() => setSelectedRole(role)}
                className={`glass-card p-3 text-left transition-all ${selectedRole === role ? 'border-blue-500/40 bg-blue-500/5' : 'hover:border-white/20'}`}>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded-full border inline-block mb-2 ${ROLE_COLORS[role]}`}>
                  {role}
                </div>
                <div className="text-lg font-bold text-white">{permCount(role)}</div>
                <div className="text-xs text-gray-500">permissions</div>
              </button>
            ))}
          </div>

          {/* Full matrix table */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Lock size={15} className="text-blue-400" />
                Permission Matrix
              </h3>
              <p className="text-xs text-gray-500 mt-1">Highlighted column is your currently selected role</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5 bg-white/2">
                  <tr>
                    <th className="table-header text-left py-3 px-4 w-48">Permission</th>
                    <th className="table-header text-left py-3 px-4 w-28">Category</th>
                    {RBAC_MATRIX.roles.map(role => (
                      <th key={role} className={`table-header text-center py-3 px-3 ${selectedRole === role ? 'text-blue-400' : ''}`}>
                        <div className={`text-xs px-2 py-0.5 rounded-full border inline-block ${ROLE_COLORS[role]}`}>{role}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <React.Fragment key={cat}>
                      <tr className="bg-white/1">
                        <td colSpan={RBAC_MATRIX.roles.length + 2} className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${CATEGORY_COLORS[cat]}`}>
                          {cat}
                        </td>
                      </tr>
                      {RBAC_MATRIX.permissions.filter(p => p.category === cat).map(perm => (
                        <tr key={perm.key} className="hover:bg-white/2 transition-colors border-b border-white/3">
                          <td className="py-2.5 px-4 text-gray-300 text-sm">{perm.label}</td>
                          <td className="py-2.5 px-4">
                            <code className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{perm.key}</code>
                          </td>
                          {RBAC_MATRIX.roles.map(role => {
                            const has = RBAC_MATRIX.matrix[role][perm.key]
                            return (
                              <td key={role} className={`py-2.5 px-3 text-center ${selectedRole === role ? 'bg-blue-500/5' : ''}`}>
                                {has
                                  ? <CheckCircle size={16} className="text-emerald-400 mx-auto" />
                                  : <XCircle size={16} className="text-gray-700 mx-auto" />
                                }
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        <>
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Users size={15} className="text-blue-400" /> User Role Assignments
              </h3>
              {!isAdmin && (
                <span className="badge-yellow"><Info size={11} /> View only — Admin required to edit</span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/5 bg-white/2">
                  <tr>
                    {['User', 'Email', 'Current Role', 'Permissions', 'Status', isAdmin ? 'Change Role' : ''].map(h => h && (
                      <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {u.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </div>
                          <span className="text-sm text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="table-cell text-gray-400 text-xs">{u.email}</td>
                      <td className="table-cell">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-white font-bold">{permCount(u.role)}</span>
                        <span className="text-gray-500 text-xs"> / {RBAC_MATRIX.permissions.length}</span>
                      </td>
                      <td className="table-cell">
                        <span className={u.status === 'Active' ? 'badge-green' : 'badge-gray'}>{u.status}</span>
                      </td>
                      {isAdmin && (
                        <td className="table-cell">
                          {editingUser === u.id ? (
                            <div className="flex items-center gap-2">
                              <select
                                className="input-field py-1 text-xs"
                                defaultValue={u.role}
                                onChange={e => setNewRole(e.target.value)}
                              >
                                {RBAC_MATRIX.roles.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                              <button onClick={() => handleRoleChange(u.id, newRole || u.role)}
                                className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                                Save
                              </button>
                              <button onClick={() => setEditingUser(null)}
                                className="text-xs text-gray-500 hover:text-white px-1 py-1">
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingUser(u.id); setNewRole(u.role) }}
                              className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 px-3 py-1 rounded-lg hover:bg-blue-500/10 transition-all">
                              Change Role
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Your permissions */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Shield size={15} className="text-blue-400" />
              Your Permissions — <span className={`text-sm ${ROLE_COLORS[user?.role]?.split(' ')[0]}`}>{user?.role}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {RBAC_MATRIX.permissions.map(p => {
                const has = RBAC_MATRIX.matrix[user?.role]?.[p.key]
                return (
                  <div key={p.key} className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                    has ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300' : 'bg-white/2 border-white/5 text-gray-600'
                  }`}>
                    {has ? <Unlock size={10} className="text-emerald-400" /> : <Lock size={10} className="text-gray-600" />}
                    {p.label}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
