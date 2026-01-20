import { OrbitControls } from '@react-three/drei/core'
import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { createWorld, trait, type Entity } from 'koota'
import { useQuery, useTraitEffect, WorldProvider } from 'koota/react'
import { memo, useEffect, useRef } from 'react'
import { Mesh } from 'three'

const Position = trait({ x: 0, y: 0 })
const IsCharacter = trait()

const world = createWorld()

const Character = ({ entity }: { entity: Entity }) => {
  const ref = useRef<Mesh>(null)

  useTraitEffect(entity, Position, position => {
    if (position) {
      ref.current.position.x = position.x
      ref.current.position.y = position.y
    }
  })

  return (
    <mesh ref={ref} scale={0.3}>
      <sphereGeometry />
      <meshBasicMaterial color="blue" />
    </mesh>
  )
}

const CharacterMemo = memo(Character)

const SpawnSystem = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const characters = world.query(IsCharacter)
      if (characters.length >= 10) {
        world.queryFirst(IsCharacter).destroy()
      }
      world.spawn(Position({ x: Math.random() * 6 - 3, y: Math.random() * 2 - 1 }), IsCharacter)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}

const MovementSystem = () => {
  useFrame(({ elapsed }) => {
    world.query(Position).updateEach(([position], entity) => {
      /* using entity as an offset number */
      position.x += Math.sin(elapsed + entity) * 0.01
      position.y += Math.cos(elapsed + entity) * 0.01
    })
  })

  return null
}

const CharacterEntities = () => {
  const characters = useQuery(Position, IsCharacter)
  return characters.map(entity => <CharacterMemo key={entity} entity={entity} />)
}

const KootaPage = () => (
  <WorldProvider world={world}>
    <Canvas>
      <CharacterEntities />
      <SpawnSystem />
      <MovementSystem />
      <OrbitControls />
    </Canvas>
  </WorldProvider>
)

KootaPage.title = 'Koota ECS'
KootaPage.description = (
  <>
    Uses{' '}
    <a href="https://github.com/pmndrs/koota" target="_blank">
      Koota
    </a>{' '}
    to manage entities. Koota is a data-oriented ECS with relations and React bindings. Define traits to query your entities, and react to their updates in your React components.
  </>
)

export default KootaPage
