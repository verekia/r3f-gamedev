# Miniplex ECS

Use Miniplex for minimalistic Entity Component System with TypeScript support.

## Technique

Define an entity type with optional properties, create a world, and query entities based on their properties. Use `miniplex-react` for React bindings with the `Entities` component.

## Key Concepts

- Entity type defines all possible components as optional properties
- `world.with('prop1', 'prop2')` creates typed queries
- `world.add()` and `world.remove()` for entity lifecycle
- `<Entities in={query}>{Component}</Entities>` renders entities reactively
- Entity props are passed directly to child components

## Usage

```tsx
type Entity = {
  position?: { x: number; y: number }
  isCharacter?: true
}

const world = new World<Entity>()
const characters = world.with('position', 'isCharacter')

// Add entity
world.add({ position: { x: 0, y: 0 }, isCharacter: true })

// Render
<Entities in={characters}>{Character}</Entities>
```

Note: Miniplex is feature-complete but no longer maintained.
