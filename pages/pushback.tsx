import { OrbitControls } from '@react-three/drei/core'
import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { useRef, useState } from 'react'
import { Color, Mesh } from 'three'

const { random, cos, sin, PI } = Math

const originalColor = new Color('red')
const pushbackColor = new Color('white')

const Entity = ({ x, y }: { x: number; y: number }) => {
  const meshRef = useRef<Mesh>(null)
  const timerRef = useRef(random() * 3)
  const [pushback, setPushback] = useState<{ dx: number; dy: number } | null>(null)
  const pushbackProgress = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    if (pushback) {
      pushbackProgress.current += delta * 8

      if (pushbackProgress.current >= 1) {
        meshRef.current.position.x = x
        meshRef.current.position.y = y
        ;(meshRef.current.material as any).color.copy(originalColor)
        setPushback(null)
        pushbackProgress.current = 0
      } else {
        const t = pushbackProgress.current
        const offset = t < 0.5 ? t * 2 : (1 - t) * 2
        meshRef.current.position.x = x + pushback.dx * offset
        meshRef.current.position.y = y + pushback.dy * offset
        ;(meshRef.current.material as any).color.copy(pushbackColor)
      }
    } else {
      timerRef.current -= delta
      if (timerRef.current <= 0) {
        timerRef.current = random() * 2 + 1
        const angle = random() * PI * 2
        setPushback({ dx: cos(angle) * 0.3, dy: sin(angle) * 0.3 })
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[x, y, 0]} scale={0.3}>
      <sphereGeometry />
      <meshBasicMaterial color={originalColor} />
    </mesh>
  )
}

const PushbackPage = () => (
  <Canvas>
    <Entity x={-1.5} y={1} />
    <Entity x={1.5} y={1} />
    <Entity x={0} y={0} />
    <Entity x={-1.5} y={-1} />
    <Entity x={1.5} y={-1} />
    <OrbitControls />
  </Canvas>
)

PushbackPage.title = 'Pushback'
PushbackPage.description = 'When enemies receive damage, make them flash white and rock them back and forth to emphasize the player\'s action. Move them in the opposite direction of the player.'

export default PushbackPage
