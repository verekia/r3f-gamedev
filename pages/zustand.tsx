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
const getWorld = useWorldStore.getState
const setWorld = useWorldStore.setState

const Character = ({ entity }: { entity: CharacterEntity }) => {
  const ref = useRef<Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = entity.position.x
      ref.current.position.y = entity.position.y
    }
  })

  return (
    <mesh ref={ref} position={[entity.position.x, entity.position.y, 0]} scale={0.3}>
      <sphereGeometry />
      <meshBasicMaterial color="blue" />
    </mesh>
  )
}

const CharacterMemo = memo(Character)

const SpawnSystem = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      let newCharacters = [...getWorld().characters]
      if (newCharacters.length >= 10) {
        newCharacters = newCharacters.slice(1)
      }
      newCharacters.push({ id: Math.random(), position: { x: Math.random() * 6 - 3, y: Math.random() * 2 - 1 } })
      setWorld({ characters: newCharacters })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}

const MovementSystem = () => {
  useFrame(({ elapsed }) => {
    for (const character of useWorldStore.getState().characters) {
      character.position.x += Math.sin(elapsed + character.id * 100) * 0.01
      character.position.y += Math.cos(elapsed + character.id * 100) * 0.01
    }
  })

  return null
}

const CharacterEntities = () => {
  const characters = useWorldStore(s => s.characters)
  return characters.map(character => <CharacterMemo key={character.id} entity={character} />)
}

const ZustandPage = () => (
  <>
    <Canvas>
      <CharacterEntities />
      <SpawnSystem />
      <MovementSystem />
      <OrbitControls />
    </Canvas>
  </>
)

ZustandPage.title = 'Zustand'
ZustandPage.description = (
  <>
    Uses{' '}
    <a href="https://github.com/pmndrs/zustand" target="_blank">
      Zustand
    </a>{' '}
    to manage entities. Not a real ECS. Re-rendering happens when entities are added to or removed from the store's
    array. Simple but the downside is that you need to explicitly tell systems what entities to iterate over.
  </>
)

export default ZustandPage
