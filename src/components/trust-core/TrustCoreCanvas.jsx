import React, { Suspense, useRef, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import DigitalTrustCore from './DigitalTrustCore'
import TrustCoreHUD from './TrustCoreHUD'
import { useTrustCore } from '../../context/TrustCoreContext'

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('NEXUS 3D ERROR:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="trust-core-error">
          <div>
            <strong>NEXUS TRUST CORE</strong>
            <span>3D engine could not initialize.</span>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function TrustCoreCanvas({
  className = '',
  inHero = false,
}) {
  const { autoRotate, threatLevel } = useTrustCore()
  const controlsRef = useRef()

  return (
    <div className={`trust-core-canvas ${inHero ? 'trust-core-hero' : ''} ${className}`}>

      <div className="trust-core-background" />

      <WebGLErrorBoundary>

<Canvas
  camera={{
    position: inHero
      ? [0, 0, 21]
      : [0, 0.5, 16],
    fov: inHero ? 48 : 55,
  }}
  dpr={[1, 1.5]}
  gl={{
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  }}
>
          <Suspense fallback={null}>

            {/* Main lighting */}
            <ambientLight
              intensity={0.7}
              color="#172554"
            />

            <directionalLight
              position={[5, 7, 6]}
              intensity={2}
              color="#dbeafe"
            />

            <directionalLight
              position={[-5, 2, -4]}
              intensity={1.2}
              color="#7c3aed"
            />

            <pointLight
              position={[0, 0, 2]}
              intensity={
                threatLevel === 'critical'
                  ? 4
                  : threatLevel === 'elevated'
                  ? 2.5
                  : 2
              }
              distance={10}
              color={
                threatLevel === 'critical'
                  ? '#ef4444'
                  : threatLevel === 'elevated'
                  ? '#f59e0b'
                  : '#00e5ff'
              }
            />

            {/* Real interactive 3D scene */}
            <DigitalTrustCore />

            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.07}
              enablePan={false}
              enableZoom={true}
              minDistance={12}
              maxDistance={30}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
              rotateSpeed={0.55}
              zoomSpeed={0.6}
              autoRotate={autoRotate}
              autoRotateSpeed={0.45}
            />

          </Suspense>

        </Canvas>

      </WebGLErrorBoundary>

      <TrustCoreHUD inHero={inHero} />

    </div>
  )
}