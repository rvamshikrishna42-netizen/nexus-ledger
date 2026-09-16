import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LuminousConduit({
  start = [0, 0, 0],
  end = [1, 1, 1],
  color = '#00f0ff',
  active = false,
  pulseSpeed = 1.2,
}) {
  const pulseRef = useRef()
  const pStart = useMemo(() => new THREE.Vector3(...start), [start])
  const pEnd = useMemo(() => new THREE.Vector3(...end), [end])

  // Midpoint with subtle curvature
  const curve = useMemo(() => {
    const mid = new THREE.Vector3()
      .addVectors(pStart, pEnd)
      .multiplyScalar(0.5)
    // Add subtle vertical and radial arch
    mid.y += 0.35
    mid.z += (pEnd.x > 0 ? 0.2 : -0.2)
    return new THREE.QuadraticBezierCurve3(pStart, mid, pEnd)
  }, [pStart, pEnd])

  const points = useMemo(() => curve.getPoints(28), [curve])
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame((state) => {
    if (pulseRef.current) {
      // Progress along curve from 0 to 1
      const t = (state.clock.elapsedTime * pulseSpeed) % 1
      const pos = curve.getPoint(t)
      pulseRef.current.position.copy(pos)
    }
  })

  return (
    <group>
      {/* Base thin luminous line */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.85 : 0.28}
          linewidth={1}
        />
      </line>

      {/* Pulsing traveling energy packet */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[active ? 0.05 : 0.032, 10, 10]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.95 : 0.65}
        />
      </mesh>
    </group>
  )
}
