import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function AccessNode({ position = [-1.8, 1.8, 0] }) {
  const { activeModule, setActiveModule, hoveredNode, setHoveredNode } = useTrustCore()
  const navigate = useNavigate()
  const groupRef = useRef()
  const shield1Ref = useRef()
  const shield2Ref = useRef()
  const shield3Ref = useRef()

  const isActive = activeModule === 'rbac'
  const isHovered = hoveredNode === 'rbac'

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    if (shield1Ref.current) {
      shield1Ref.current.rotation.z += 0.2 * d
    }
    if (shield2Ref.current) {
      shield2Ref.current.rotation.z -= 0.3 * d
    }
    if (shield3Ref.current) {
      shield3Ref.current.rotation.y += 0.4 * d
    }
  })

  const primaryColor = isActive ? '#a855f7' : '#8b5cf6'

  return (
    <group position={position}>
      <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.25}>
        <group
          ref={groupRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredNode('rbac')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredNode(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveModule('rbac')
            navigate('/rbac')
          }}
        >
          {/* Layer 1: Outer RBAC Perimeter Shield */}
          <group ref={shield1Ref}>
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.58, 0.58, 0.08, 6)]} />
              <lineBasicMaterial color="#8b5cf6" linewidth={2} />
            </lineSegments>
          </group>

          {/* Layer 2: Mid Permission Gate Shield */}
          <group ref={shield2Ref}>
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.44, 0.44, 0.12, 6)]} />
              <lineBasicMaterial color="#a855f7" linewidth={2} />
            </lineSegments>
            <mesh>
              <cylinderGeometry args={[0.42, 0.42, 0.06, 6]} />
              <meshPhysicalMaterial
                color="#140b29"
                emissive="#7c3aed"
                emissiveIntensity={isActive ? 0.8 : 0.3}
                roughness={0.25}
                metalness={0.9}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>

          {/* Layer 3: Inner Core Key / Lock */}
          <group ref={shield3Ref}>
            <mesh>
              <octahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#c084fc"
                emissiveIntensity={isActive ? 1.0 : 0.6}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
          </group>

          {/* Radiating Access Channels */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.12, 0.02, 0.02]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
          ))}

          <pointLight
            color={primaryColor}
            intensity={isActive ? 1.6 : 0.7}
            distance={2.4}
            decay={2}
          />
        </group>
      </Float>

      {(isHovered || isActive) && (
        <Html position={[0, 0.85, 0]} center distanceFactor={10}>
          <div className="pointer-events-none select-none px-2.5 py-1 rounded bg-[#0a0e1a]/90 backdrop-blur border border-purple-500/40 text-[11px] font-mono text-purple-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            ACCESS CONTROL • 5 ROLES / 18 PERMS
          </div>
        </Html>
      )}
    </group>
  )
}
