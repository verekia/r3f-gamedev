---
name: model-container
description: Capture Three.js object references via a wrapper component for system access.
---

# Model Container

Capture Three.js object references on entities using a wrapper component, allowing systems to manipulate objects directly.

## Entity vs Model Pattern

Similar to the Redux container/component pattern:

- **`*Entity`** components are smart wrappers that connect entity data to the view
- **`*Model`** components are dumb and only responsible for rendering

```
┌─────────────────────────────────────────┐
│  PlayerEntity (smart)                   │
│  - Wraps with ModelContainer            │
│  - Passes entity data as props          │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │  PlayerModel (dumb)             │  │
│    │  - Pure rendering               │  │
│    │  - Receives props               │  │
│    │  - No knowledge of entities     │  │
│    └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Usage

```tsx
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

// Dumb component - only renders, receives props
const PlayerModel = ({ color, scale }: { color: string; scale: number }) => (
  <mesh scale={scale}>
    <boxGeometry />
    <meshBasicMaterial color={color} />
  </mesh>
)

// Smart wrapper - connects entity to model
const PlayerEntity = ({ entity }: { entity: PlayerData }) => (
  <ModelContainer entity={entity}>
    <PlayerModel color={entity.team === 'red' ? 'red' : 'blue'} scale={entity.size} />
  </ModelContainer>
)

// System manipulates entity.three directly
const MovementSystem = () => {
  useFrame(() => {
    if (player.three) {
      player.three.position.x = player.x
      player.three.rotation.y += 0.01
    }
  })
  return null
}
```

## Key Concepts

- Ref callback stores the Three.js object on the entity
- Cleanup function removes the reference when unmounted
- Systems access `entity.three` directly in `useFrame`
- Models are reusable and testable in isolation
- Entities handle the bridge between game state and visuals

## Benefits

- Clear separation of concerns
- Models can be developed/tested independently
- Entity logic stays with entity components
- Systems don't need to know about React component structure
- Works with any entity system (ECS, Zustand, plain objects)
