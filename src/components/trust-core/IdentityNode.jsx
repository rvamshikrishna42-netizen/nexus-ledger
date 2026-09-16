import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function IdentityNode({ position = [-3.2, 0.4, 0] }) {
  const { activeModule, setActiveModule, hoveredNode, setHoveredNode } = useTrustCore()
  const navigate = useNavigate()
  const groupRef = useRef()
  const ringRef = useRef()
  const badgeRef = useRef()

  const isActive = activeModule === 'identity'
  const isHovered = hoveredNode === 'identity'

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.25 * d
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.5 * d
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
    }
    if (badgeRef.current) {
      badgeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.3
    }
  })

  const primaryColor = isActive ? '#10b981' : '#00f0ff'
  const emissiveColor = isActive ? '#059669' : '#0066ff'

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group
          ref={groupRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredNode('identity')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredNode(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveModule('identity')
            navigate('/identity')
          }}
        >
          {/* Outer Holographic Biometric Ring */}
          <mesh ref={ringRef}>
            <torusGeometry args={[0.62, 0.016, 12, 48]} />
            <meshStandardMaterial
              color="#0d1b3e"
              emissive={primaryColor}
              emissiveIntensity={isActive ? 0.9 : 0.45}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Verification Shield / Badge */}
          <group ref={badgeRef}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.34, 0.26, 0.52, 6]} />
              <meshPhysicalMaterial
                color="#0a1226"
                emissive={emissiveColor}
                emissiveIntensity={isActive ? 0.8 : 0.35}
                roughness={0.2}
                metalness={0.85}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>

            {/* Wireframe Shield Rim */}
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.35, 0.27, 0.53, 6)]} />
              <lineBasicMaterial color={primaryColor} linewidth={2} />
            </lineSegments>

            {/* Verified Emerald Core Glow */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.9} />
            </mesh>

            {/* Checkmark / DID glyph */}
            <mesh position={[0, 0, 0.28]} rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[0.04, 0.16, 0.02]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.07, 0.04, 0.28]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.04, 0.26, 0.02]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Base Node Anchor */}
          <mesh position={[0, -0.42, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 0.08, 16]} />
            <meshStandardMaterial color="#0b1329" emissive="#0066ff" emissiveIntensity={0.3} />
          </mesh>

          {/* Emissive Point Light */}
          <pointLight
            color={primaryColor}
            intensity={isActive ? 1.8 : 0.8}
            distance={2.5}
            decay={2}
          />
        </group>
      </Float>

      {/* Floating Info Tag on Hover/Active */}
      {(isHovered || isActive) && (
        <Html position={[0, 0.85, 0]} center distanceFactor={10}>
          <div className="pointer-events-none select-none px-2.5 py-1 rounded bg-[#0a0e1a]/90 backdrop-blur border border-emerald-500/40 text-[11px] font-mono text-emerald-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            IDENTITY VAULT • VERIFIED
          </div>
        </Html>
      )}
    </group>
  )
}
