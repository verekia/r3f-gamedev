import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { useRef } from 'react'
import { Mesh } from 'three'

let position = { x: 0, y: 0 }

const Ui = () => {
  const ref = useRef<HTMLDivElement>(null)

  useFrame(
    () => {
      if (ref.current) {
        ref.current.innerText = `${position.x.toFixed(2)}, ${position.y.toFixed(2)}`
      }
    },
    { fps: 10 }
  )

  return <div ref={ref} className="fixed top-4 right-4 tabular-nums" />
}

const Box = () => {
  const ref = useRef<Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = position.x
      ref.current.position.y = position.y
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
  useFrame(({ elapsed }) => {
    position.x = Math.sin(elapsed)
    position.y = Math.cos(elapsed)
  })

  return null
}

const UiUseframePage = () => (
  <>
    <Canvas>
      <Box />
    </Canvas>
    <MovementSystem />
    <Ui />
  </>
)

UiUseframePage.title = 'UI useFrame'
UiUseframePage.description =
  'Since R3F v10, useFrame can be used outside of the Canvas, to sync the UI. Throttled because DOM manipulation is expensive.'

export default UiUseframePage
