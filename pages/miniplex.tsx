import { OrbitControls } from '@react-three/drei/core'
import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { World } from 'miniplex'
import createReactAPI from 'miniplex-react'
import { useEffect, useRef } from 'react'
import { Mesh } from 'three'

type Entity = {
  id: number
  position?: { x: number; y: number }
  isCharacter?: true
}

const world = new World<Entity>()

const characterQuery = world.with('id', 'position', 'isCharacter')
type CharacterEntity = (typeof characterQuery)['entities'][number]

const entitiesWithPosition = world.with('position')

const { Entities } = createReactAPI(world)

// Neat trick: the props are the actual entity thanks to Character being the children of <Entities> below
const Character = (character: CharacterEntity) => {
  const ref = useRef<Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = character.position.x
      ref.current.position.y = character.position.y
    }
  })

  return (
    <mesh ref={ref} position={[character.position.x, character.position.y, 0]} scale={0.3}>
      <sphereGeometry />
      <meshBasicMaterial color="blue" />
    </mesh>
  )
}

const SpawnSystem = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (characterQuery.entities.length >= 10) {
        world.remove(characterQuery.entities[0])
      }
      world.add({
        id: Math.random(),
        position: { x: Math.random() * 6 - 3, y: Math.random() * 2 - 1 },
        isCharacter: true,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}

const MovementSystem = () => {
  useFrame(({ elapsed }) => {
    for (const entity of entitiesWithPosition) {
      entity.position.x += Math.sin(elapsed + entity.id * 5) * 0.01
      entity.position.y += Math.cos(elapsed + entity.id * 5) * 0.01
    }
  })

  return null
}

const MiniplexPage = () => (
  <>
    <Canvas>
      <Entities in={characterQuery}>{Character}</Entities>
      <SpawnSystem />
      <MovementSystem />
      <OrbitControls />
    </Canvas>
  </>
)

MiniplexPage.title = 'Miniplex ECS'
MiniplexPage.description = (
  <>
    Uses{' '}
    <a href="https://github.com/hmans/miniplex" target="_blank">
      Miniplex
    </a>{' '}
    to manage entities. Minimalistic ECS with great types and React bindings. Define an entity type and query what you
    need based on its propoerties. Please note that Miniplex is feature-complete but no longer maintained.
  </>
)

export default MiniplexPage
