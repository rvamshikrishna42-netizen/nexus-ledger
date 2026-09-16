import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticlesField({ count = 220 }) {
  const pointsRef = useRef()

  // Generate random particle positions & colors
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#0066ff'), // electric blue
      new THREE.Color('#00f0ff'), // cyan
      new THREE.Color('#8b5cf6'), // violet
      new THREE.Color('#10b981'), // emerald
    ]

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical spread
      const theta = Math.random() * Math.PI * 2
      const radius = 2.0 + Math.random() * 6.5
      const y = (Math.random() - 0.5) * 7.0

      pos[i * 3] = Math.cos(theta) * radius
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = Math.sin(theta) * radius

      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.04
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
