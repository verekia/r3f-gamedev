import { Canvas, useFrame, useThree } from '@react-three/fiber/webgpu'
import { useEffect } from 'react'

const rotationOffset = { x: 0, z: 0 }

const addSmoothExp = (current: number, target: number, speed: number, dt: number) =>
  (target - current) * (1 - Math.exp(-speed * dt))

const shake = (intensity = 0.05) => {
  rotationOffset.x = (Math.random() - 0.5) * intensity
  rotationOffset.z = (Math.random() - 0.5) * intensity
}

const CameraShake = () => {
  const { camera } = useThree()

  useFrame((_, delta) => {
    rotationOffset.x += addSmoothExp(rotationOffset.x, 0, 10, delta)
    rotationOffset.z += addSmoothExp(rotationOffset.z, 0, 10, delta)
    camera.rotation.x = rotationOffset.x
    camera.rotation.z = rotationOffset.z
  })

  return null
}

const ShakeTrigger = () => {
  useEffect(() => {
    const interval = setInterval(() => shake(0.05), 1000)
    return () => clearInterval(interval)
  }, [])

  return null
}

const CameraShakePage = () => (
  <>
    <Canvas>
      <CameraShake />
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
      <mesh position={[-2, 1, 0]}>
        <boxGeometry />
        <meshBasicMaterial color="blue" />
      </mesh>
      <mesh position={[2, 1, 0]}>
        <boxGeometry />
        <meshBasicMaterial color="green" />
      </mesh>
    </Canvas>
    <ShakeTrigger />
  </>
)

CameraShakePage.title = 'Camera Shake'
CameraShakePage.description =
  'Instantly rotate the camera on X (pitch) and Z (roll) axes and smoothly return to the base rotation using exponential decay. Useful for visual feedback when the player gets hit.'

export default CameraShakePage
