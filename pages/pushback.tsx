import { OrbitControls } from '@react-three/drei/core'
import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { useRef } from 'react'
import { Mesh, MeshBasicMaterial } from 'three'

const Enemy = ({ x, y }: { x: number; y: number }) => {
  const meshRef = useRef<Mesh>(null)
  const matRef = useRef<MeshBasicMaterial>(null)
  const timerRef = useRef(Math.random() * 3)
  const pushbackRef = useRef<{ dx: number; dy: number } | null>(null)
  const pushbackProgress = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return

    if (pushbackRef.current) {
      pushbackProgress.current += delta * 8
      matRef.current.color.set('white')

      if (pushbackProgress.current >= 1) {
        meshRef.current.position.x = x
        meshRef.current.position.y = y
        pushbackRef.current = null
        pushbackProgress.current = 0
        matRef.current.color.set('red')
      } else {
        const t = pushbackProgress.current
        const offset = t < 0.5 ? t * 2 : (1 - t) * 2
        meshRef.current.position.x = x + pushbackRef.current.dx * offset
        meshRef.current.position.y = y + pushbackRef.current.dy * offset
      }
    } else {
      timerRef.current -= delta
      if (timerRef.current <= 0) {
        // You'd normally trigger the pushback effect from outside of the entity
        timerRef.current = Math.random() * 2 + 1
        const angle = Math.random() * Math.PI * 2
        pushbackRef.current = { dx: Math.cos(angle) * 0.3, dy: Math.sin(angle) * 0.3 }
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[x, y, 0]} scale={0.3}>
      <sphereGeometry />
      <meshBasicMaterial ref={matRef} color="red" />
    </mesh>
  )
}

const PushbackPage = () => (
  <Canvas>
    <Enemy x={-1.5} y={1} />
    <Enemy x={1.5} y={1} />
    <Enemy x={0} y={0} />
    <Enemy x={-1.5} y={-1} />
    <Enemy x={1.5} y={-1} />
    <OrbitControls />
  </Canvas>
)

PushbackPage.title = 'Pushback'
PushbackPage.description =
  "When enemies receive damage, make them flash white and rock them back and forth to emphasize the player's action. Move them in the opposite direction of the player."

export default PushbackPage
