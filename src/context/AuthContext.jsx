import React, { createContext, useContext, useState, useEffect } from 'react'
import { DEMO_USERS } from '../data/demoData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(true) // Always demo for MVP

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem('nexus_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Try demo users first
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (found) {
      const { password: _, ...safeUser } = found
      const sessionUser = { ...safeUser, loginTime: new Date().toISOString() }
      setUser(sessionUser)
      localStorage.setItem('nexus_user', JSON.stringify(sessionUser))
      addAuditLog('LOGIN', 'Auth System', 'Success', 'Low', sessionUser)
      return { success: true, user: sessionUser }
    }

    // Try real API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        localStorage.setItem('nexus_user', JSON.stringify(data.user))
        setDemoMode(false)
        return { success: true, user: data.user }
      }
    } catch {}

    return { success: false, error: 'Invalid credentials. Use demo accounts below.' }
  }

  const register = async (name, email, password) => {
    // In demo mode, simulate registration
    const existing = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existing) return { success: false, error: 'Email already registered.' }

    const newUser = {
      id: Date.now(),
      name,
      email,
      role: 'User',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      did: `did:nexus:${generateHex(32)}`,
      status: 'active',
      created: new Date().toISOString(),
      loginTime: new Date().toISOString(),
    }
    setUser(newUser)
    localStorage.setItem('nexus_user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nexus_user')
  }

  const addAuditLog = (action, resource, status, risk, u) => {
    const logs = JSON.parse(localStorage.getItem('nexus_audit') || '[]')
    logs.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: u?.name || 'System',
      role: u?.role || 'System',
      action,
      resource,
      txHash: null,
      risk,
      status,
      ip: '127.0.0.1',
    })
    localStorage.setItem('nexus_audit', JSON.stringify(logs.slice(0, 200)))
  }

  return (
    <AuthContext.Provider value={{ user, loading, demoMode, login, register, logout, addAuditLog }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

function generateHex(len) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}
