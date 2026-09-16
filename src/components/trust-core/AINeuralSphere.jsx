import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function AINeuralSphere({ position = [-2.2, -1.2, 0] }) {
  const {
    activeModule,
    setActiveModule,
    hoveredNode,
    setHoveredNode,
    threatLevel,
    riskScore,
    anomaliesToday,
  } = useTrustCore()
  const navigate = useNavigate()

  const groupRef = useRef()
  const sphereRef = useRef()
  const scanRingRef = useRef()
  const pulseRef = useRef()

  const isActive = activeModule === 'anomalies' || activeModule === 'security'
  const isHovered = hoveredNode === 'anomalies' || hoveredNode === 'security'

  const isHighRisk = threatLevel === 'critical' || riskScore > 60
  const isElevated = threatLevel === 'elevated' || riskScore > 35

  const coreColor = isHighRisk
    ? '#ef4444'
    : isElevated
    ? '#f59e0b'
    : '#00f0ff'

  const emissiveColor = isHighRisk
    ? '#dc2626'
    : isElevated
    ? '#d97706'
    : '#0066ff'

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    const speed = isHighRisk ? 2.5 : isElevated ? 1.6 : 1.0

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.3 * d * speed
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.12
    }

    // Scanning radar ring oscillation
    if (scanRingRef.current) {
      scanRingRef.current.rotation.z += 0.6 * d * speed
      scanRingRef.current.scale.setScalar(
        1.0 + Math.sin(state.clock.elapsedTime * 2.8 * speed) * 0.12
      )
    }

    // Threat pulse expander
    if (pulseRef.current) {
      const pulse = 1.0 + (Math.sin(state.clock.elapsedTime * 4.0 * speed) * 0.5 + 0.5) * 0.25
      pulseRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group
          ref={groupRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredNode('security')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredNode(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveModule('security')
            navigate('/security')
          }}
        >
          {/* Outer Geodesic Neural Wireframe Sphere */}
          <mesh ref={sphereRef}>
            <icosahedronGeometry args={[0.55, 2]} />
            <meshStandardMaterial
              color="#071329"
              emissive={emissiveColor}
              emissiveIntensity={isActive ? 0.9 : 0.45}
              wireframe
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Glowing Inner Synaptic Core */}
          <mesh>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshPhysicalMaterial
              color="#040b18"
              emissive={coreColor}
              emissiveIntensity={isHighRisk ? 1.2 : 0.65}
              metalness={0.95}
              roughness={0.15}
              clearcoat={1}
            />
          </mesh>

          {/* Anomaly Pulse Wave */}
          <mesh ref={pulseRef}>
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshBasicMaterial
              color={coreColor}
              transparent
              opacity={isHighRisk ? 0.45 : isElevated ? 0.25 : 0.12}
              wireframe
            />
          </mesh>

          {/* Radar Scanning Ring */}
          <group ref={scanRingRef} rotation={[Math.PI / 3, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.72, 0.012, 8, 48]} />
              <meshBasicMaterial
                color={coreColor}
                transparent
                opacity={0.8}
              />
            </mesh>
            {/* Radar scanner blip */}
            <mesh position={[0.72, 0, 0]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          <pointLight
            color={coreColor}
            intensity={isHighRisk ? 2.8 : isActive ? 1.8 : 0.8}
            distance={2.8}
            decay={2}
          />
        </group>
      </Float>

      {(isHovered || isActive) && (
        <Html position={[0, 0.95, 0]} center distanceFactor={10}>
          <div
            className={`pointer-events-none select-none px-2.5 py-1 rounded bg-[#0a0e1a]/90 backdrop-blur border ${
              isHighRisk
                ? 'border-red-500/50 text-red-300'
                : isElevated
                ? 'border-amber-500/50 text-amber-300'
                : 'border-cyan-500/40 text-cyan-300'
            } text-[11px] font-mono whitespace-nowrap shadow-lg flex items-center gap-1.5`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isHighRisk
                  ? 'bg-red-500'
                  : isElevated
                  ? 'bg-amber-400'
                  : 'bg-cyan-400'
              } animate-pulse`}
            ></span>
            AI SECURITY CORE • RISK: {riskScore}% ({threatLevel.toUpperCase()})
          </div>
        </Html>
      )}
    </group>
  )
}
