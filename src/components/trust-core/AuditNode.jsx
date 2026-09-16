import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function AuditNode({ position = [0, 2.2, 0] }) {
  const { activeModule, setActiveModule, hoveredNode, setHoveredNode } = useTrustCore()
  const navigate = useNavigate()
  const groupRef = useRef()
  const stackRef = useRef()

  const isActive = activeModule === 'audit'
  const isHovered = hoveredNode === 'audit'

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
    if (stackRef.current) {
      stackRef.current.rotation.y += 0.2 * d
    }
  })

  const primaryColor = isActive ? '#00f0ff' : '#6366f1'

  // 3 stacked holographic ledger slabs
  const slabs = [-0.14, 0, 0.14]

  return (
    <group position={position}>
      <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.25}>
        <group
          ref={groupRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredNode('audit')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredNode(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveModule('audit')
            navigate('/audit')
          }}
        >
          {/* Stacked Holographic Ledger Slabs */}
          <group ref={stackRef}>
            {slabs.map((y, idx) => (
              <group key={idx} position={[0, y, 0]}>
                <mesh>
                  <boxGeometry args={[0.62, 0.05, 0.44]} />
                  <meshPhysicalMaterial
                    color="#09142b"
                    emissive={primaryColor}
                    emissiveIntensity={idx === 2 ? 0.75 : 0.35}
                    roughness={0.2}
                    metalness={0.88}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(0.622, 0.052, 0.442)]} />
                  <lineBasicMaterial color={primaryColor} linewidth={1.5} />
                </lineSegments>
              </group>
            ))}
          </group>

          {/* Central Cryptographic Seal Beam */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.48, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>

          <pointLight
            color={primaryColor}
            intensity={isActive ? 1.8 : 0.8}
            distance={2.5}
            decay={2}
          />
        </group>
      </Float>

      {(isHovered || isActive) && (
        <Html position={[0, 0.75, 0]} center distanceFactor={10}>
          <div className="pointer-events-none select-none px-2.5 py-1 rounded bg-[#0a0e1a]/90 backdrop-blur border border-indigo-500/40 text-[11px] font-mono text-indigo-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            IMMUTABLE AUDIT TRAIL • TAMPER-PROOF
          </div>
        </Html>
      )}
    </group>
  )
}
