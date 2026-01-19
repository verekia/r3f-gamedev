import { OrbitControls } from '@react-three/drei/core'
import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { memo, useEffect, useRef } from 'react'
import { Mesh } from 'three'
import { create } from 'zustand'

type CharacterEntity = {
  id: number
  position: { x: number; y: number }
}

const defaultState = {
  characters: [] as CharacterEntity[],
}

const useWorldStore = create<typeof defaultState>(() => defaultState)

const Character = ({ character }: { character: CharacterEntity }) => {
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

const CharacterMemo = memo(Character)

const SpawnSystem = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      useWorldStore.setState(s => ({
        characters: [
          ...s.characters.filter((_, index) => index < 10),
          { id: Math.random(), position: { x: Math.random() * 6 - 3, y: Math.random() * 2 - 1 } },
        ],
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}

const MovementSystem = () => {
  useFrame(({ elapsed }) => {
    for (const character of useWorldStore.getState().characters) {
      character.position.x += Math.sin(elapsed + character.id * 5) * 0.01
      character.position.y += Math.cos(elapsed + character.id * 5) * 0.01
    }
  })

  return null
}

const CharacterEntities = () => {
  const characters = useWorldStore(s => s.characters)
  return characters.map(character => <CharacterMemo key={character.id} character={character} />)
}

const CssHealthBarsPage = () => (
  <>
    <Canvas>
      <CharacterEntities />
      <SpawnSystem />
      <MovementSystem />
      <OrbitControls />
    </Canvas>
  </>
)

CssHealthBarsPage.title = 'Zustand Entities'
CssHealthBarsPage.description =
  'Uses Zustand to manage entities. Re-rendering happens when entities are added to or removed from the store\s array. Simple but the downside is that you need to explicitly tell systems what entities to iterate over. Use memo() to make sure the individual entities are not re-rendered when the array of entities changes.'

export default CssHealthBarsPage
