import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

let position = { x: 0, y: 0 }

const useReactive = <T,>(selector: () => T, fps = 30): T => {
  const [reactiveValue, setReactiveValue] = useState<T>(selector())
  const previousValueRef = useRef(reactiveValue)

  useFrame(
    () => {
      const newValue = selector()
      if (previousValueRef.current !== newValue) {
        previousValueRef.current = newValue
        setReactiveValue(newValue)
      }
    },
    { fps },
  )

  return reactiveValue
}

const Box = () => {
  const ref = useRef<Mesh>(null)
  const isAboveZero = useReactive(() => position.y > 0)

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = position.x
      ref.current.position.y = position.y
    }
  })

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshBasicMaterial color={isAboveZero ? 'blue' : 'green'} />
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

const ReactivePollingPage = () => (
  <>
    <Canvas className="h-full">
      <Box />
    </Canvas>
    <MovementSystem />
  </>
)

ReactivePollingPage.title = 'Reactive Polling'
ReactivePollingPage.description =
  'Sometimes, a reactive state helps keep your components simple. useReactive is a hook that polls for changes of any value and rerenders your component. Use sparingly for things that don\'t change too often.'

export default ReactivePollingPage
