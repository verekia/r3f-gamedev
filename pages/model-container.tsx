import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { ReactNode } from 'react'
import { Object3D } from 'three'

type Entity = {
  three?: Object3D
}

const ModelContainer = ({ children, entity }: { children: ReactNode; entity: Entity }) => (
  <group
    ref={ref => {
      if (!ref) return
      entity.three = ref
      return () => {
        entity.three = undefined
      }
    }}
  >
    {children}
  </group>
)

const box: Entity = {}

// Dumb component - only renders, receives props
const BoxModel = ({ color }: { color: string }) => (
  <mesh>
    <boxGeometry />
    <meshBasicMaterial color={color} />
  </mesh>
)

// Smart wrapper - connects entity to model
const BoxEntity = ({ entity }: { entity: Entity }) => (
  <ModelContainer entity={entity}>
    <BoxModel color="red" />
  </ModelContainer>
)

const RotationSystem = () => {
  useFrame((_, delta) => {
    if (box.three) {
      box.three.rotation.y += delta
    }
  })

  return null
}

const ModelContainerPage = () => (
  <Canvas>
    <BoxEntity entity={box} />
    <RotationSystem />
  </Canvas>
)

ModelContainerPage.title = 'Model Container'
ModelContainerPage.description =
  'Capture Three.js object references via a ModelContainer component. Entity components are smart wrappers, Model components are dumb renderers.'

export default ModelContainerPage
