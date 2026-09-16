import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function CertificateNode({ position = [3.2, 0.4, 0] }) {
  const {
    activeModule,
    setActiveModule,
    hoveredNode,
    setHoveredNode,
    verificationState,
  } = useTrustCore()
  const navigate = useNavigate()

  const groupRef = useRef()
  const scanBeamRef = useRef()
  const certRef = useRef()
  const sealRef = useRef()

  const isActive = activeModule === 'certificates'
  const isHovered = hoveredNode === 'certificates'

  const isScanning = verificationState === 'scanning'
  const isVerified = verificationState === 'verified'
  const isTampered = verificationState === 'tampered'

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)

    // Gentle float rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.2
    }

    // Scanning laser beam movement
    if (scanBeamRef.current) {
      if (isScanning) {
        scanBeamRef.current.position.y = Math.sin(state.clock.elapsedTime * 6.0) * 0.35
        scanBeamRef.current.visible = true
      } else if (isActive) {
        scanBeamRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.0) * 0.35
        scanBeamRef.current.visible = true
      } else {
        scanBeamRef.current.visible = false
      }
    }

    // Seal rotation
    if (sealRef.current) {
      sealRef.current.rotation.z += 0.4 * d
    }
  })

  // Dynamic colors based on verification state
  const primaryColor = isTampered
    ? '#ef4444'
    : isVerified
    ? '#10b981'
    : isScanning
    ? '#00f0ff'
    : isActive
    ? '#10b981'
    : '#059669'

  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.3}>
        <group
          ref={groupRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredNode('certificates')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredNode(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveModule('certificates')
            navigate('/certificates')
          }}
        >
          {/* Certificate Credential Plate */}
          <group ref={certRef}>
            <mesh>
              <boxGeometry args={[0.55, 0.72, 0.024]} />
              <meshPhysicalMaterial
                color="#0a1526"
                emissive={isTampered ? '#7f1d1d' : isVerified ? '#064e3b' : '#0b2347'}
                emissiveIntensity={0.65}
                roughness={0.2}
                metalness={0.8}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>

            {/* Glowing Border Frame */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.56, 0.73, 0.026)]} />
              <lineBasicMaterial color={primaryColor} linewidth={2} />
            </lineSegments>

            {/* Header / Seal on Certificate */}
            <group ref={sealRef} position={[0, 0.22, 0.016]}>
              <cylinderGeometry args={[0.07, 0.07, 0.008, 16]} />
              <meshBasicMaterial color={primaryColor} />
            </group>

            {/* Simulated text lines */}
            {[-0.02, -0.09, -0.16, -0.23].map((y, idx) => (
              <mesh key={idx} position={[0, y, 0.016]}>
                <planeGeometry args={[0.38 - idx * 0.04, 0.016]} />
                <meshBasicMaterial
                  color={primaryColor}
                  transparent
                  opacity={0.65}
                />
              </mesh>
            ))}

            {/* Verification Watermark Check */}
            {(isVerified || (!isTampered && isActive)) && (
              <mesh position={[0.16, -0.22, 0.018]}>
                <circleGeometry args={[0.05, 16]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.85} />
              </mesh>
            )}
          </group>

          {/* Animated Verification Scanning Laser Beam */}
          <mesh ref={scanBeamRef} position={[0, 0, 0.035]}>
            <boxGeometry args={[0.62, 0.018, 0.02]} />
            <meshBasicMaterial
              color={isTampered ? '#f97316' : isVerified ? '#10b981' : '#00f0ff'}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Verification feedback particles (shown when verified) */}
          {isVerified && (
            <mesh position={[0, 0, 0.2]}>
              <ringGeometry args={[0.35, 0.42, 24]} />
              <meshBasicMaterial
                color="#10b981"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          <pointLight
            color={primaryColor}
            intensity={isActive || isScanning ? 2.0 : 0.8}
            distance={2.5}
            decay={2}
          />
        </group>
      </Float>

      {(isHovered || isActive) && (
        <Html position={[0, 0.85, 0]} center distanceFactor={10}>
          <div className="pointer-events-none select-none px-2.5 py-1 rounded bg-[#0a0e1a]/90 backdrop-blur border border-emerald-500/40 text-[11px] font-mono text-emerald-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {isScanning
              ? 'OPTICAL SHA-256 SCAN IN PROGRESS...'
              : isTampered
              ? 'WARNING: TAMPER DETECTED'
              : 'CERTIFICATE VERIFICATION • 2,891 AUTHENTIC'}
          </div>
        </Html>
      )}
    </group>
  )
}
