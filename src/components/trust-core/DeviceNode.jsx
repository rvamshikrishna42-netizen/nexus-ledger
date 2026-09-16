import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function DeviceNode({ position = [2.2, -1.2, 0] }) {
  const {
    activeModule,
    setActiveModule,
    hoveredNode,
    setHoveredNode,
    unknownDeviceDetected,
  } = useTrustCore()
  const navigate = useNavigate()

  const groupRef = useRef()
  const laptopRef = useRef()
  const phoneRef = useRef()
  const keyRef = useRef()

  const isActive = activeModule === 'devices'
  const isHovered = hoveredNode === 'devices'

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.2 * d
    }
    if (keyRef.current) {
      keyRef.current.rotation.z += 0.4 * d
    }
  })

  const trustedColor = '#10b981'
  const warningColor = '#f59e0b'

  return (
    <group position={position}>
      <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.25}>
        <group
          ref={groupRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredNode('devices')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredNode(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveModule('devices')
            navigate('/devices')
          }}
        >
          {/* Workstation Endpoint (Trusted, Green Glow) */}
          <group ref={laptopRef} position={[-0.15, 0.1, 0]}>
            {/* Screen */}
            <mesh position={[0, 0.14, -0.06]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.32, 0.22, 0.02]} />
              <meshPhysicalMaterial
                color="#061c16"
                emissive={trustedColor}
                emissiveIntensity={0.4}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Base keyboard */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.34, 0.02, 0.24]} />
              <meshStandardMaterial color="#0b1a2b" metalness={0.9} />
            </mesh>
            {/* Trust aura ring */}
            <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.26, 20]} />
              <meshBasicMaterial color={trustedColor} transparent opacity={0.65} />
            </mesh>
          </group>

          {/* Mobile Phone / Tablet Endpoint */}
          <group ref={phoneRef} position={[0.26, -0.08, 0.12]} rotation={[0.1, -0.3, 0]}>
            <mesh>
              <boxGeometry args={[0.12, 0.24, 0.016]} />
              <meshPhysicalMaterial
                color="#0a1824"
                emissive={unknownDeviceDetected ? warningColor : trustedColor}
                emissiveIntensity={unknownDeviceDetected ? 0.9 : 0.4}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            {/* Screen border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.122, 0.242, 0.018)]} />
              <lineBasicMaterial
                color={unknownDeviceDetected ? warningColor : trustedColor}
              />
            </lineSegments>
          </group>

          {/* Hardware Security Key (FIDO2 / YubiKey) */}
          <group ref={keyRef} position={[-0.24, -0.22, 0.08]}>
            <mesh>
              <boxGeometry args={[0.07, 0.16, 0.02]} />
              <meshStandardMaterial
                color="#081426"
                emissive="#00f0ff"
                emissiveIntensity={0.6}
              />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.025, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          <pointLight
            color={unknownDeviceDetected ? warningColor : trustedColor}
            intensity={isActive ? 1.8 : 0.8}
            distance={2.4}
            decay={2}
          />
        </group>
      </Float>

      {(isHovered || isActive) && (
        <Html position={[0, 0.85, 0]} center distanceFactor={10}>
          <div className="pointer-events-none select-none px-2.5 py-1 rounded bg-[#0a0e1a]/90 backdrop-blur border border-emerald-500/40 text-[11px] font-mono text-emerald-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                unknownDeviceDetected ? 'bg-amber-400' : 'bg-emerald-400'
              } animate-pulse`}
            ></span>
            {unknownDeviceDetected
              ? 'UNKNOWN ENDPOINT DETECTED'
              : 'DEVICE TRUST • 874 ATTESTED'}
          </div>
        </Html>
      )}
    </group>
  )
}
