---
name: verekia-stores
description: Zustand stores for managing state outside of the ECS, like user preferences and UI state.
---

# Zustand Stores

Use Zustand stores for state that doesn't belong in the ECS. Each store has a consistent API pattern with `use*`, `get*`, `set*`, and `reset*` exports.

## Store Types

- **core-store**: Global reactive state that doesn't fit in ECS (room metadata, connection status)
- **ui-store**: UI state like modals, panels, debug overlays
- **local-store**: User preferences persisted to localStorage

## Core Store

For global reactive state that doesn't fit in ECS:

```ts
// stores/core-store.ts
import { create } from 'zustand'

const defaultState: {
  isDebugMode: false
}

type State = typeof defaultState
type Key = keyof State

const useCoreStore = create<State>(() => structuredClone(defaultState))
export const useCore = <K extends Key>(key: K) => useCoreStore(state => state[key])
export const getCore = useCoreStore.getState
export const setCore = <K extends Key>(...args: [key: K, value: State[K]] | [state: Partial<State>]) =>
  useCoreStore.setState(args.length === 2 ? { [args[0]]: args[1] } : args[0])
export const resetCore = () => useCoreStore.setState(structuredClone(defaultState))

// @ts-expect-error Normal
if (typeof window !== 'undefined') window.getCore = getCore
```

## UI Store

For UI state like modals and debug info:

```ts
// stores/ui-store.ts
import { create } from 'zustand'

const defaultState = {
  areSettingsOpen: false,
}

type State = typeof defaultState
type Key = keyof State

export type UIState = State
export type UIKey = Key

const useUIStore = create<State>(() => structuredClone(defaultState))
export const useUI = <K extends Key>(key: K) => useUIStore(state => state[key])
export const getUI = useUIStore.getState
export const setUI = <K extends Key>(...args: [key: K, value: State[K]] | [state: Partial<State>]) =>
  useUIStore.setState(args.length === 2 ? { [args[0]]: args[1] } : args[0])
export const resetUI = () => setUI(structuredClone(defaultState))

export const isAnyModalOpen = () => {
  const ui = getUI()
  return ui.areSettingsOpen
}

export const closeAnyModal = () => {
  if (getUI().areSettingsOpen) {
    setUI('areSettingsOpen', false)
    return true
  }

  return false
}

export const useIsAnyModalOpen = () => {
  const areSettingsOpen = useUI('areSettingsOpen')

  return areSettingsOpen
}

// @ts-expect-error Normal
if (typeof window !== 'undefined') window.getUI = getUI
```

## Local Store (Persisted)

For user preferences synced with localStorage:

```ts
// stores/local-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultState = {
  hello: 'world',
}

type State = typeof defaultState
type Key = keyof State

const useLocalStore = create<State>()(persist(() => structuredClone(defaultState), { name: 'my-game-local' }))
export const useLocal = <K extends Key>(key: K) => useLocalStore(state => state[key])
export const getLocal = useLocalStore.getState
export const setLocal = <K extends Key>(...args: [key: K, value: State[K]] | [state: Partial<State>]) =>
  useLocalStore.setState(args.length === 2 ? { [args[0]]: args[1] } : args[0])
export const resetLocal = () => setLocal(structuredClone(defaultState))

// @ts-expect-error Normal
if (typeof window !== 'undefined') window.getLocal = getLocal
```

## Usage

```tsx
// In React components (reactive)
const areSettingsOpen = useUI('areSettingsOpen')

// Outside React / in systems (non-reactive)
const settings = getUI().areSettingsOpen

// Setting values
setUI('areSettingsOpen', true)
setUI({ areSettingsOpen: true, debug: { drawCalls: 100 } })

// Reset to defaults
resetUI()
```

## Key Concepts

- `use*` hooks for reactive access in React components
- `get*` for non-reactive access in systems or callbacks
- `set*` supports both single key-value and partial state updates
- `reset*` restores default state
- Attach `get*` to `window` for debugging in browser console
- Use `structuredClone(defaultState)` to avoid mutation issues

---

This skill is part of [verekia](https://x.com/verekia)'s [**r3f-gamedev**](https://github.com/verekia/r3f-gamedev).
