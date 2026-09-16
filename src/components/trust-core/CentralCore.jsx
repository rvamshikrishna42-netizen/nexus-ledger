import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function CentralCore() {
  const {
    threatLevel,
    riskScore,
    activeModule,
    setActiveModule,
    setHoveredNode,
  } = useTrustCore()

  const globeRef = useRef()
  const wireRef = useRef()
  const shellRef = useRef()
  const innerEnergyRef = useRef()
  const orbitARef = useRef()
  const orbitBRef = useRef()
  const orbitCRef = useRef()
  const shieldRef = useRef()
  const particlesRef = useRef()

  const isHighRisk =
    threatLevel === 'critical' || riskScore > 60

  const isElevated =
    threatLevel === 'elevated' || riskScore > 35

  const coreColor = isHighRisk
    ? '#ff3158'
    : isElevated
      ? '#ffae35'
      : '#00eaff'

  const secondaryColor = isHighRisk
    ? '#ff1744'
    : isElevated
      ? '#ff7a18'
      : '#6366ff'

  const speedMultiplier = isHighRisk
    ? 2.2
    : isElevated
      ? 1.45
      : 1

  /*
   * Digital globe points
   */
  const particlePositions = useMemo(() => {
    const positions = []
    const count = 150

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(
        1 - 2 * Math.random()
      )

      const theta =
        Math.random() * Math.PI * 2

      const radius =
        1.03 + Math.random() * 0.12

      positions.push(
        Math.sin(phi) *
          Math.cos(theta) *
          radius,

        Math.cos(phi) * radius,

        Math.sin(phi) *
          Math.sin(theta) *
          radius
      )
    }

    return new Float32Array(positions)
  }, [])

  /*
   * Animation
   */
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const time = state.clock.elapsedTime

    /*
     * Main globe rotation
     */
    if (globeRef.current) {
      globeRef.current.rotation.y +=
        0.12 * d * speedMultiplier

      globeRef.current.rotation.x =
        Math.sin(time * 0.25) * 0.035
    }

    /*
     * Digital wireframe rotation
     */
    if (wireRef.current) {
      wireRef.current.rotation.y -=
        0.16 * d * speedMultiplier

      wireRef.current.rotation.z =
        Math.sin(time * 0.3) * 0.035
    }

    /*
     * Transparent atmosphere
     */
    if (shellRef.current) {
      const pulse =
        1 +
        Math.sin(time * 1.7) * 0.025

      shellRef.current.scale.set(
        pulse,
        pulse,
        pulse
      )

      shellRef.current.rotation.y +=
        0.06 * d
    }

    /*
     * Inner energy
     */
    if (innerEnergyRef.current) {
      const pulse =
        1 +
        Math.sin(time * 2.2) * 0.055

      innerEnergyRef.current.scale.set(
        pulse,
        pulse,
        pulse
      )

      innerEnergyRef.current.rotation.y +=
        0.22 * d
    }

    /*
     * Three independent orbital rings
     */
    if (orbitARef.current) {
      orbitARef.current.rotation.z +=
        0.22 * d * speedMultiplier

      orbitARef.current.rotation.x =
        0.65 +
        Math.sin(time * 0.4) * 0.08
    }

    if (orbitBRef.current) {
      orbitBRef.current.rotation.y -=
        0.28 * d * speedMultiplier

      orbitBRef.current.rotation.z =
        -0.55 +
        Math.sin(time * 0.35) * 0.06
    }

    if (orbitCRef.current) {
      orbitCRef.current.rotation.x +=
        0.18 * d * speedMultiplier

      orbitCRef.current.rotation.y +=
        0.12 * d
    }

    /*
     * Central shield
     */
    if (shieldRef.current) {
      shieldRef.current.rotation.y =
        Math.sin(time * 0.65) * 0.08

      shieldRef.current.position.z =
        1.05 +
        Math.sin(time * 1.6) * 0.025
    }

    /*
     * Digital particles
     */
    if (particlesRef.current) {
      particlesRef.current.rotation.y +=
        0.035 * d

      particlesRef.current.rotation.x +=
        0.012 * d
    }
  })

  const isOverview =
    activeModule === 'overview' ||
    activeModule === 'security'

  return (
    <Float
      speed={0.9}
      rotationIntensity={0.08}
      floatIntensity={0.16}
    >
      <group
        scale={1.0}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredNode('core')
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHoveredNode(null)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          setActiveModule('overview')
        }}
      >

        {/* ==================================================
            REAL 3D DIGITAL GLOBE
        ================================================== */}

        <mesh ref={globeRef}>
          <sphereGeometry
            args={[0.96, 64, 64]}
          />

          <meshPhysicalMaterial
            color="#06142d"
            emissive={coreColor}
            emissiveIntensity={
              isHighRisk ? 0.38 : 0.18
            }
            metalness={0.82}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>


        {/* ==================================================
            DIGITAL WIREFRAME SURFACE
        ================================================== */}

        <mesh ref={wireRef}>
          <sphereGeometry
            args={[0.985, 32, 20]}
          />

          <meshBasicMaterial
            color={coreColor}
            wireframe
            transparent
            opacity={
              isHighRisk
                ? 0.72
                : 0.38
            }
          />
        </mesh>


        {/* ==================================================
            INNER ENERGY SPHERE
        ================================================== */}

<mesh ref={innerEnergyRef}>
  <sphereGeometry
    args={[0.58, 48, 48]}
  />

<meshStandardMaterial
  color="#07111f"
  emissive={coreColor}
  emissiveIntensity={isHighRisk ? 0.7 : 0.3}
  metalness={0.88}
  roughness={0.22}
/>
</mesh>


{/* ==================================================
    OUTER ATMOSPHERE
================================================== */}

<mesh ref={shellRef}>
  <sphereGeometry
    args={[1.08, 48, 48]}
  />

<meshStandardMaterial
  color="#0a1424"
  emissive={coreColor}
  emissiveIntensity={isHighRisk ? 0.35 : 0.12}
  metalness={0.45}
  roughness={0.38}
  transparent
  opacity={0.16}
  depthWrite={false}
/>
</mesh>


        {/* ==================================================
            GLOBE LATITUDE RINGS
        ================================================== */}

        <group rotation={[0.18, 0, 0]}>
          <mesh>
            <torusGeometry
              args={[0.88, 0.008, 8, 96]}
            />

            <meshBasicMaterial
              color="#00d9ff"
              transparent
              opacity={0.55}
            />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry
              args={[0.72, 0.006, 8, 96]}
            />

            <meshBasicMaterial
              color={secondaryColor}
              transparent
              opacity={0.42}
            />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry
              args={[0.48, 0.005, 8, 96]}
            />

            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>


        {/* ==================================================
            ORBITAL RING A
        ================================================== */}

        <group ref={orbitARef}>
          <mesh>
            <torusGeometry
              args={[1.34, 0.018, 12, 128]}
            />

            <meshStandardMaterial
              color="#10214a"
              emissive={coreColor}
              emissiveIntensity={
                isOverview ? 1.1 : 0.55
              }
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>

          {/* Small orbital marker bead on ring A */}
          <mesh position={[1.34, 0, 0]}>
            <sphereGeometry args={[0.048, 10, 10]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>


        {/* ==================================================
            ORBITAL RING B
        ================================================== */}

        <group ref={orbitBRef}>
          <mesh>
            <torusGeometry
              args={[1.48, 0.014, 10, 128]}
            />

            <meshBasicMaterial
              color={secondaryColor}
              transparent
              opacity={0.78}
            />
          </mesh>

          <mesh position={[0, 1.48, 0]}>
            <sphereGeometry
              args={[0.055, 12, 12]}
            />

            <meshBasicMaterial
              color="#10b981"
            />
          </mesh>

          <mesh position={[0, -1.48, 0]}>
            <sphereGeometry
              args={[0.055, 12, 12]}
            />

            <meshBasicMaterial
              color="#00f0ff"
            />
          </mesh>
        </group>


        {/* ==================================================
            ORBITAL RING C
        ================================================== */}

        <group ref={orbitCRef}>
          <mesh>
            <torusGeometry
              args={[1.62, 0.009, 8, 128]}
            />

            <meshBasicMaterial
              color="#496bff"
              transparent
              opacity={0.55}
            />
          </mesh>

          <mesh position={[1.62, 0, 0]}>
            <boxGeometry
              args={[0.11, 0.06, 0.06]}
            />

            <meshBasicMaterial
              color="#00eaff"
            />
          </mesh>
        </group>


        {/* ==================================================
            CENTRAL HOLOGRAPHIC SHIELD
        ================================================== */}

        <group
          ref={shieldRef}
          position={[0, 0, 1.05]}
        >

          {/* Shield body */}
          <mesh>
            <cylinderGeometry
              args={[0.38, 0.30, 0.08, 6]}
            />

            <meshPhysicalMaterial
              color="#06264a"
              emissive={coreColor}
              emissiveIntensity={1.2}
              metalness={0.7}
              roughness={0.2}
              transparent
              opacity={0.92}
            />
          </mesh>

          {/* Shield outer hologram */}
          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.CylinderGeometry(
                  0.43,
                  0.34,
                  0.09,
                  6
                ),
              ]}
            />

            <lineBasicMaterial
              color={coreColor}
              transparent
              opacity={0.95}
            />
          </lineSegments>

          {/* Fingerprint rings */}
          <mesh
            position={[0, 0.055, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[0.08, 0.105, 32]}
            />

            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.95}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh
            position={[0, 0.058, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[0.15, 0.175, 32]}
            />

            <meshBasicMaterial
              color={coreColor}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh
            position={[0, 0.061, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[0.23, 0.25, 32]}
            />

            <meshBasicMaterial
              color="#00eaff"
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>

        </group>


        {/* ==================================================
            DIGITAL PARTICLES AROUND THE CORE
        ================================================== */}

        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlePositions.length / 3}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>

          <pointsMaterial
            color="#00d9ff"
            size={0.025}
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>


        {/* ==================================================
            CENTRAL LIGHT
        ================================================== */}

        <pointLight
          color={coreColor}
          intensity={
            isHighRisk
              ? 4.2
              : isElevated
                ? 3
                : 2.2
          }
          distance={5.5}
          decay={2}
        />

        <pointLight
          color="#315cff"
          intensity={1.2}
          distance={4}
          decay={2}
          position={[1.5, 1.5, 1]}
        />

      </group>
    </Float>
  )
}