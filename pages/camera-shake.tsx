import { Canvas, useFrame, useThree } from '@react-three/fiber/webgpu'
import { useEffect } from 'react'
import { Vector3 } from 'three'

const basePosition = new Vector3(0, 0, 5)

const offset = { x: 0, y: 0 }

const addSmoothExp = (current: number, target: number, speed: number, dt: number) =>
  (target - current) * (1 - Math.exp(-speed * dt))

const shake = (intensity = 0.5) => {
  offset.x = (Math.random() - 0.3) * intensity
  offset.y = (Math.random() - 0.3) * intensity
}

const CameraShake = () => {
  const { camera } = useThree()

  useFrame((_, delta) => {
    offset.x += addSmoothExp(offset.x, 0, 10, delta)
    offset.y += addSmoothExp(offset.y, 0, 10, delta)
    camera.position.x = basePosition.x + offset.x
    camera.position.y = basePosition.y + offset.y
  })

  return null
}

const ShakeTrigger = () => {
  useEffect(() => {
    const interval = setInterval(() => shake(0.5), 1000)
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
  'Instantly offset the camera and smoothly return to the base position using exponential decay. Useful for visual feedback when the player gets hit.'

export default CameraShakePage
