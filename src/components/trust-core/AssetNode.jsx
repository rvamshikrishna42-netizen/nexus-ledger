import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function AssetNode({ position = [1.8, 1.8, 0] }) {
  const { activeModule, setActiveModule, hoveredNode, setHoveredNode } = useTrustCore()
  const navigate = useNavigate()
  const crystalRef = useRef()
  const ringRef = useRef()

  const isActive = activeModule === 'assets'
  const isHovered = hoveredNode === 'assets'

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    if (crystalRef.current) {
      crystalRef.current.rotation.y += (isHovered ? 1.2 : 0.4) * d
      crystalRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.3 * d
    }
  })

  const primaryColor = isActive ? '#00f0ff' : '#06b6d4'

  return (
    <group position={position}>
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.35}>
        <group
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredNode('assets')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredNode(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveModule('assets')
            navigate('/assets')
          }}
        >
          {/* Floating Cryptographic NFT Crystal */}
          <group ref={crystalRef}>
            <mesh>
              <octahedronGeometry args={[0.38, 0]} />
              <meshPhysicalMaterial
                color="#062035"
                emissive="#00f0ff"
                emissiveIntensity={isActive ? 0.8 : 0.4}
                roughness={0.15}
                metalness={0.9}
                clearcoat={1}
                clearcoatRoughness={0.05}
                transmission={0.4}
                opacity={0.9}
                transparent
              />
            </mesh>

            {/* Wireframe facet highlights */}
            <lineSegments>
              <edgesGeometry args={[new THREE.OctahedronGeometry(0.39, 0)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </lineSegments>

            {/* Inner Glowing Token Core */}
            <mesh>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          </group>

          {/* Holographic Token Metadata Ring */}
          <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.54, 0.014, 10, 48]} />
            <meshStandardMaterial
              color="#0d2338"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Tiny orbiting credential satellites */}
          {[-0.45, 0.45].map((x, i) => (
            <mesh key={i} position={[x, 0, 0.35]}>
              <boxGeometry args={[0.06, 0.08, 0.015]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
            </mesh>
          ))}

          <pointLight
            color={primaryColor}
            intensity={isActive ? 1.8 : 0.7}
            distance={2.4}
            decay={2}
          />
        </group>
      </Float>

      {(isHovered || isActive) && (
        <Html position={[0, 0.85, 0]} center distanceFactor={10}>
          <div className="pointer-events-none select-none px-2.5 py-1 rounded bg-[#0a0e1a]/90 backdrop-blur border border-cyan-500/40 text-[11px] font-mono text-cyan-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            DIGITAL ASSETS • 3,542 ON-CHAIN
          </div>
        </Html>
      )}
    </group>
  )
}
