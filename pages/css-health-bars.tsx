import { Html, OrbitControls } from '@react-three/drei/core'
import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { useRef } from 'react'

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

const Character = ({ x }: { x: number }) => {
  const healthRef = useRef<HTMLDivElement>(null)

  useFrame(
    () => {
      if (healthRef.current) {
        healthRef.current.style.transform = `scaleX(${Math.random()})`
      }
    },
    { fps: 1 }
  )

  return (
    <mesh position-x={x} scale={0.5}>
      <sphereGeometry />
      <meshBasicMaterial color="blue" />

      <Html center position-y={1.5} distanceFactor={5}>
        <div className="-skew-x-25 overflow-hidden rounded-md border-solid bg-red-500 ring-1 ring-white/80 ring-offset-3 ring-offset-black">
          <div ref={healthRef} className="h-8 w-50 origin-left bg-green-500 transition-transform duration-300" />
        </div>
      </Html>
    </mesh>
  )
}

const CssHealthBarsPage = () => (
  <>
    <Canvas className="h-full">
      <Character x={-2} />
      <Character x={0} />
      <Character x={2} />
      <OrbitControls />
    </Canvas>
  </>
)

CssHealthBarsPage.title = 'CSS Health Bars'
CssHealthBarsPage.description = 'Use Drei Html to render health bars that you can style with CSS.'

export default CssHealthBarsPage
