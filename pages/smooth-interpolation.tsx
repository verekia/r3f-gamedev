import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { useEffect, useRef } from 'react'
import { Mesh } from 'three'

let position = { x: 0, y: 0 }

// https://lisyarus.github.io/blog/posts/exponential-smoothing.html
// Equivalent formulation: target + (current - target) * Math.exp(-decay * dt) — see https://www.youtube.com/watch?v=LSNQuFEDOyQ
const addSmoothExp = (current: number, target: number, speed: number, dt: number) =>
  (target - current) * (1 - Math.exp(-speed * dt))

const Box = () => {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += addSmoothExp(ref.current.position.x, position.x, 3, delta)
      ref.current.position.y += addSmoothExp(ref.current.position.y, position.y, 3, delta)
    }
  })

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshBasicMaterial color="red" />
    </mesh>
  )
}

const MovementSystem = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      position.x = Math.random() * 3 - 1.5
      position.y = Math.random() * 3 - 1.5
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}

const SmoothInterpolationPage = () => (
  <>
    <Canvas>
      <Box />
    </Canvas>
    <MovementSystem />
  </>
)

SmoothInterpolationPage.title = 'Smooth Interpolation'
SmoothInterpolationPage.description =
  'Interpolate between two values to animate objects smoothly. Exponential smoothing (or decay) gives a nicer feel than linear interpolation.'

export default SmoothInterpolationPage
