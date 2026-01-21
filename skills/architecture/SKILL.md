---
name: architecture
description: Separate game logic in systems from React components which are only views.
---

# Architecture

The core principle of R3F game development is separating game logic from rendering. React components are views, not the source of truth.

## Systems vs Views

**Systems** contain all game logic:

- Movement, physics, collision detection
- Spawning and destroying entities
- State mutations (health, score, timers)
- AI and behavior
- Syncing Three.js objects with entity state

**Views** (React components) only render:

- `<PlayerEntity>`, `<EnemyEntity>` wrap models with `ModelContainer`
- `<PlayerModel>`, `<EnemyModel>` are dumb and only render meshes
- They don't contain game logic or `useFrame` calls
- No `useFrame` in view components - that belongs in systems

## Headless-First Mindset

Games should be capable of running entirely without a renderer:

```
┌─────────────────────────────────────────┐
│            Game Logic Layer             │
│  (Systems, ECS, World State, Entities)  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│            View Layer (optional)        │
│   React Three Fiber / DOM / Headless    │
└─────────────────────────────────────────┘
```

This means:

- All state lives in the world/ECS, not in React components
- Systems iterate over entities and mutate state
- Views subscribe to state and render accordingly
- You could swap R3F for DOM elements or run tests headlessly

## Example Structure

```tsx
// World state (Zustand, Koota, Miniplex, etc.)
const world = { enemies: [], player: { x: 0, y: 0, health: 100 } }

// System - game logic only
const VelocitySystem = () => {
  useFrame((_, delta) => {
    for (const enemy of world.enemies) {
      enemy.x += enemy.velocityX * delta
      enemy.y += enemy.velocityY * delta
    }
  })
  return null
}

// System - syncs Three.js objects with entity state
const ThreeSystem = () => {
  useFrame(() => {
    for (const enemy of world.enemies) {
      if (enemy.three) {
        enemy.three.position.x = enemy.x
        enemy.three.position.y = enemy.y
      }
    }
  })
  return null
}

// Dumb model - only renders, no useFrame, no logic
const EnemyModel = () => (
  <mesh>
    <sphereGeometry />
    <meshBasicMaterial color="red" />
  </mesh>
)

// Smart wrapper - connects entity to model via ModelContainer
const EnemyEntity = ({ entity }: { entity: Enemy }) => (
  <ModelContainer entity={entity}>
    <EnemyModel />
  </ModelContainer>
)
```

## Key Principles

- **No `useFrame` in view components**: All `useFrame` calls belong in systems
- **Entity/Model separation**: `*Entity` components are smart wrappers, `*Model` components are dumb renderers
- **Systems sync Three.js**: Systems update both entity state AND `entity.three` positions/rotations
- **Decouple completely**: The game should work if you delete all view components
