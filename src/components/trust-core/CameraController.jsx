import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTrustCore } from '../../context/TrustCoreContext'

export default function CameraController({ controlsRef }) {
  const { currentPreset, activeModule } = useTrustCore()
  const { camera } = useThree()

  const targetCamPos = useRef(
    new THREE.Vector3(...currentPreset.cameraPos)
  )

  const targetLookAt = useRef(
    new THREE.Vector3(...currentPreset.targetPos)
  )

  const currentLookAt = useRef(
    new THREE.Vector3(...currentPreset.targetPos)
  )

  useEffect(() => {
    targetCamPos.current.set(
      ...currentPreset.cameraPos
    )

    /*
     * Move the visual center slightly upward.
     *
     * The camera looks a little above the actual
     * Trust Core, which places the 3D object lower
     * inside the canvas instead of cutting its top.
     */
    targetLookAt.current.set(
      currentPreset.targetPos[0],
      currentPreset.targetPos[1] + 0.75,
      currentPreset.targetPos[2]
    )
  }, [currentPreset, activeModule])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)

    const lerpFactor =
      1 - Math.exp(-4.5 * d)

    /*
     * Very subtle mouse parallax.
     */
    const parallaxX =
      state.pointer.x * 0.18

    const parallaxY =
      state.pointer.y * 0.12

    const desiredX =
      targetCamPos.current.x +
      parallaxX

    const desiredY =
      targetCamPos.current.y +
      parallaxY

    const desiredZ =
      targetCamPos.current.z

    /*
     * Smooth camera movement.
     */
    camera.position.x +=
      (desiredX - camera.position.x) *
      lerpFactor

    camera.position.y +=
      (desiredY - camera.position.y) *
      lerpFactor

    camera.position.z +=
      (desiredZ - camera.position.z) *
      lerpFactor

    /*
     * Smooth look-at movement.
     */
    currentLookAt.current.x +=
      (targetLookAt.current.x -
        currentLookAt.current.x) *
      lerpFactor

    currentLookAt.current.y +=
      (targetLookAt.current.y -
        currentLookAt.current.y) *
      lerpFactor

    currentLookAt.current.z +=
      (targetLookAt.current.z -
        currentLookAt.current.z) *
      lerpFactor

    if (controlsRef?.current) {
      controlsRef.current.target.copy(
        currentLookAt.current
      )

      controlsRef.current.update()
    } else {
      camera.lookAt(
        currentLookAt.current
      )
    }
  })

  return null
}