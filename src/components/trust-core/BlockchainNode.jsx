import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useTrustCore } from '../../context/TrustCoreContext'

const BLOCKS_DATA = [
  { num: '#18951822', txs: '42 tx', hash: '0x3c9e...9a0b' },
  { num: '#18951823', txs: '128 tx', hash: '0x7f3a...4a6c' },
  { num: '#18951824', txs: '89 tx', hash: '0x2a4c...9c1e' },
]

export default function BlockchainNode({ position = [0, -2.4, 0] }) {
  const {
    activeModule,
    setActiveModule,
    hoveredNode,
    setHoveredNode,
    txPulses,
  } = useTrustCore()
  const navigate = useNavigate()

  const groupRef = useRef()
  const txParticleRef = useRef()

  const isActive = activeModule === 'blockchain'
  const isHovered = hoveredNode === 'blockchain'

  // Block positions in a neat linked line
  const blockOffsets = [-0.75, 0, 0.75]

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    }

    // Continuously animate transaction packet traveling through the chain
    if (txParticleRef.current) {
      const t = (state.clock.elapsedTime * 1.5) % 1
      // Lerp from first block to last block
      const x = -0.75 + t * 1.5
      txParticleRef.current.position.x = x
      txParticleRef.current.position.y = Math.sin(t * Math.PI) * 0.12
    }
  })

  const primaryColor = isActive ? '#00f0ff' : '#0066ff'

  return (
    <group position={position}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
        <group
          ref={groupRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredNode('blockchain')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredNode(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveModule('blockchain')
            navigate('/blockchain')
          }}
        >
          {/* Chain of 3 Linked Blocks */}
          {blockOffsets.map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.38, 0.38, 0.38]} />
                <meshPhysicalMaterial
                  color="#051226"
                  emissive={primaryColor}
                  emissiveIntensity={idx === 2 ? 0.85 : 0.4}
                  roughness={0.18}
                  metalness={0.92}
                  clearcoat={1}
                />
              </mesh>

              {/* Wireframe bevels */}
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(0.382, 0.382, 0.382)]} />
                <lineBasicMaterial color="#00f0ff" linewidth={2} />
              </lineSegments>

              {/* Block core crystal */}
              <mesh>
                <octahedronGeometry args={[0.12, 0]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>

              {/* Connected rail to next block */}
              {idx < 2 && (
                <group position={[0.375, 0, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.37, 8]} />
                    <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} />
                  </mesh>
                </group>
              )}
            </group>
          ))}

          {/* Traveling Transaction Particle */}
          <mesh ref={txParticleRef} position={[-0.75, 0, 0.22]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>

          <pointLight
            color={primaryColor}
            intensity={isActive ? 2.0 : 0.9}
            distance={2.8}
            decay={2}
          />
        </group>
      </Float>

      {(isHovered || isActive) && (
        <Html position={[0, 0.75, 0]} center distanceFactor={10}>
          <div className="pointer-events-none select-none px-2.5 py-1 rounded bg-[#0a0e1a]/90 backdrop-blur border border-blue-500/40 text-[11px] font-mono text-blue-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            BLOCKCHAIN EXPLORER • 18,951,824 BLOCKS
          </div>
        </Html>
      )}
    </group>
  )
}
