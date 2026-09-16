import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

// 3D Module presets: camera positions and focus targets
export const MODULE_PRESETS = {
  overview: {
    id: 'overview',
    label: 'Trust Core Nexus',
    cameraPos: [0, 2.2, 9.2],
    targetPos: [0, 0, 0],
    fov: 45,
    description: 'Autonomous 6-Pillar Cryptographic Trust Architecture',
  },
  identity: {
    id: 'identity',
    label: 'Digital Identity Vault',
    cameraPos: [-3.8, 1.8, 4.2],
    targetPos: [-3.2, 0.4, 0],
    fov: 40,
    description: 'W3C Verifiable Credentials & DID Anchors',
  },
  rbac: {
    id: 'rbac',
    label: 'Access Control Matrix',
    cameraPos: [-2.2, 3.2, 4.5],
    targetPos: [-1.8, 1.8, 0],
    fov: 40,
    description: 'Cryptographic Permission Conduits & Role Shields',
  },
  assets: {
    id: 'assets',
    label: 'Digital Asset Registry',
    cameraPos: [2.2, 3.2, 4.5],
    targetPos: [1.8, 1.8, 0],
    fov: 40,
    description: 'NFT-Secured Sovereign Ownership Prisms',
  },
  certificates: {
    id: 'certificates',
    label: 'Certificate Verification',
    cameraPos: [3.8, 1.8, 4.2],
    targetPos: [3.2, 0.4, 0],
    fov: 38,
    description: 'Real-Time SHA-256 Optical Hash Verification',
  },
  devices: {
    id: 'devices',
    label: 'Endpoint Trust Matrix',
    cameraPos: [2.8, -1.8, 4.8],
    targetPos: [2.2, -1.2, 0],
    fov: 40,
    description: 'Hardware Enclave & Attested Endpoints',
  },
  anomalies: {
    id: 'anomalies',
    label: 'Risk Intelligence Engine',
    cameraPos: [-2.8, -1.8, 4.8],
    targetPos: [-2.2, -1.2, 0],
    fov: 40,
    description: 'Behavioral Threat Vectors & Neural Surveillance',
  },
  security: {
    id: 'security',
    label: 'AI Security Core',
    cameraPos: [0, 0.5, 4.8],
    targetPos: [0, 0, 0],
    fov: 42,
    description: 'Autonomous Threat Countermeasures & Real-Time Risk Core',
  },
  blockchain: {
    id: 'blockchain',
    label: 'Consensus Ledger Explorer',
    cameraPos: [0, -3.2, 5.0],
    targetPos: [0, -2.4, 0],
    fov: 42,
    description: 'Immutable Block Synthesis & Cross-Node Gossip',
  },
  audit: {
    id: 'audit',
    label: 'Holographic Audit Trail',
    cameraPos: [0, 3.4, 5.2],
    targetPos: [0, 2.2, 0],
    fov: 42,
    description: 'Sequenced Tamper-Proof Cryptographic Log Slabs',
  },
  analytics: {
    id: 'analytics',
    label: 'Telemetry & Quantum Metrics',
    cameraPos: [2.5, 0.5, 6.5],
    targetPos: [0.5, 0, 0],
    fov: 44,
    description: 'Distributed Security Telemetry & Throughput',
  },
  settings: {
    id: 'settings',
    label: 'Calm Core Nexus',
    cameraPos: [0, 1.8, 8.5],
    targetPos: [0, 0, 0],
    fov: 45,
    description: 'Quiescent State & Core Engine Calibration',
  },
}

const TrustCoreContext = createContext(null)

export function TrustCoreProvider({ children }) {
  const location = useLocation()

  // Active module state
  const [activeModule, setActiveModule] = useState('overview')
  const [hoveredNode, setHoveredNode] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  // View presentation mode: 'docked' (split view), 'full' (full screen 3D), 'compact'
  const [viewMode, setViewMode] = useState('docked')

  // Real application behavioral states connected to 3D
  const [verificationState, setVerificationState] = useState('idle') // 'idle' | 'scanning' | 'verified' | 'tampered'
  const [verificationHash, setVerificationHash] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  const [threatLevel, setThreatLevel] = useState('low') // 'low' | 'elevated' | 'critical'
  const [riskScore, setRiskScore] = useState(18)
  const [anomaliesToday, setAnomaliesToday] = useState(3)
  const [txPulses, setTxPulses] = useState([])
  const [unknownDeviceDetected, setUnknownDeviceDetected] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [particleDensity, setParticleDensity] = useState('medium') // 'low' | 'medium' | 'high'

  // Map current route to 3D module
  useEffect(() => {
    const path = location.pathname
    if (path === '/' || path === '/dashboard') {
      setActiveModule('overview')
    } else if (path.startsWith('/identity')) {
      setActiveModule('identity')
    } else if (path.startsWith('/rbac')) {
      setActiveModule('rbac')
    } else if (path.startsWith('/assets')) {
      setActiveModule('assets')
    } else if (path.startsWith('/certificates')) {
      setActiveModule('certificates')
    } else if (path.startsWith('/devices')) {
      setActiveModule('devices')
    } else if (path.startsWith('/anomalies')) {
      setActiveModule('anomalies')
    } else if (path.startsWith('/security')) {
      setActiveModule('security')
    } else if (path.startsWith('/blockchain')) {
      setActiveModule('blockchain')
    } else if (path.startsWith('/audit')) {
      setActiveModule('audit')
    } else if (path.startsWith('/analytics')) {
      setActiveModule('analytics')
    } else if (path.startsWith('/settings')) {
      setActiveModule('settings')
    } else {
      setActiveModule('overview')
    }
  }, [location.pathname])

  // Trigger certificate verification 3D animation
  const triggerVerification = useCallback((isAuthentic = true, hash = '') => {
    setVerificationState('scanning')
    if (hash) setVerificationHash(hash)
    
    setTimeout(() => {
      setVerificationState(isAuthentic ? 'verified' : 'tampered')
    }, 1500)
  }, [])

  // Trigger simulated threat
  const simulateThreat = useCallback((level = 'elevated', score = 65) => {
    setThreatLevel(level)
    setRiskScore(score)
    if (level === 'critical') {
      setAnomaliesToday(prev => prev + 1)
    }
  }, [])

  // Reset threat to baseline
  const resetThreat = useCallback(() => {
    setThreatLevel('low')
    setRiskScore(18)
  }, [])

  // Trigger blockchain transaction particle
  const emitTransaction = useCallback((txHash = null) => {
    const newPulse = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      hash: txHash || '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    }
    setTxPulses(prev => [...prev.slice(-6), newPulse])
  }, [])

  // Toggle unknown device alert
  const toggleDeviceAlert = useCallback(() => {
    setUnknownDeviceDetected(prev => !prev)
  }, [])

  const currentPreset = MODULE_PRESETS[activeModule] || MODULE_PRESETS.overview

  const value = {
    activeModule,
    setActiveModule,
    currentPreset,
    hoveredNode,
    setHoveredNode,
    selectedNode,
    setSelectedNode,
    viewMode,
    setViewMode,
    verificationState,
    verificationHash,
    triggerVerification,
    setVerificationState,
    threatLevel,
    riskScore,
    anomaliesToday,
    simulateThreat,
    resetThreat,
    txPulses,
    emitTransaction,
    unknownDeviceDetected,
    toggleDeviceAlert,
    autoRotate,
    setAutoRotate,
    particleDensity,
    setParticleDensity,
  }

  return (
    <TrustCoreContext.Provider value={value}>
      {children}
    </TrustCoreContext.Provider>
  )
}

export function useTrustCore() {
  const context = useContext(TrustCoreContext)
  if (!context) {
    throw new Error('useTrustCore must be used within a TrustCoreProvider')
  }
  return context
}
