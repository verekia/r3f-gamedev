---
name: verekia-miniplex
description: Verekia's preferred patterns for using Miniplex ECS with minimal React bindings.
---

# Verekia's Miniplex Patterns

Opinionated usage of Miniplex that keeps React bindings minimal.

## What NOT to Use from miniplex-react

**Never use:**

- `ECS.Entity` - Don't use this component
- `ECS.Component` - Don't use this component
- `ECS.world` - Don't access world through ECS, use direct import
- `useEntities` hook - Don't use this
- Render props pattern - Don't use this

**Only use:**

```tsx
const { Entities } = createReactAPI(world)
```

That's it. We only use `<Entities>` for rendering entities matching a query.

## Setup Pattern

```tsx
import { World } from 'miniplex'
import createReactAPI from 'miniplex-react'

// Define entity type with optional components
type Entity = {
  position?: { x: number; y: number }
  velocity?: { x: number; y: number }
  isCharacter?: true
  isEnemy?: true
}

// Create world (exported for systems to use directly)
export const world = new World<Entity>()

// Create queries
export const characterQuery = world.with('position', 'isCharacter')
export const enemyQuery = world.with('position', 'isEnemy')

// Derive entity types from queries
type CharacterEntity = (typeof characterQuery)['entities'][number]
type EnemyEntity = (typeof enemyQuery)['entities'][number]

// Only destructure Entities from React API
const { Entities } = createReactAPI(world)
```

## Entity as Props Pattern

The component passed to `<Entities>` receives the entity directly as props:

```tsx
// The entity IS the props - neat trick!
// Note: No useFrame here - position sync happens in ThreeSystem (see verekia-architecture)
const CharacterModel = () => (
  <mesh>
    <sphereGeometry />
    <meshBasicMaterial color="blue" />
  </mesh>
)

const CharacterEntity = (character: CharacterEntity) => (
  <ModelContainer entity={character}>
    <CharacterModel />
  </ModelContainer>
)

// Usage - CharacterEntity receives entity as props
;<Entities in={characterQuery}>{CharacterEntity}</Entities>
```

## Systems Access World Directly

Systems import and use the world directly, not through React:

```tsx
import { world, characterQuery } from './ecs'

const MovementSystem = () => {
  useFrame(() => {
    for (const entity of characterQuery) {
      entity.position.x += entity.velocity.x
      entity.position.y += entity.velocity.y
    }
  })

  return null
}

const SpawnSystem = () => {
  useEffect(() => {
    world.add({ position: { x: 0, y: 0 }, isCharacter: true })
  }, [])

  return null
}
```

## Key Principles

- World and queries are plain module exports, not React context
- `<Entities>` is the only bridge between Miniplex and React rendering
- Entity components receive the entity as their props directly
- Systems iterate over queries directly, no React hooks for entity access
- Derive typed entities from queries: `(typeof query)['entities'][number]`

## Related Skills

- `verekia-architecture` - Systems vs Views separation, no useFrame in view components
- `verekia-model-container` - ModelContainer pattern for capturing Three.js refs
- `miniplex` - Core Miniplex concepts and preferred methods

---

This skill is part of [verekia](https://x.com/verekia)'s [**r3f-gamedev**](https://github.com/verekia/r3f-gamedev).
