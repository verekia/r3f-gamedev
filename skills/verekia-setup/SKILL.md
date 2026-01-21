---
name: verekia-setup
description: Verekia's preferred project setup with Next.js Pages Router, Tailwind 4, Prettier, and TypeScript.
---

# Verekia's Preferences

Personal preferences for project setup on top of the base R3F stack.

## Next.js Pages Router

Use the Pages Router with static export:

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  output: 'export',
}

export default nextConfig
```

Pages go in `pages/` directory. Each file becomes a route. `'use client'` directives should not be used since we are in the Pages router.

Dependencies:

```json
{
  "dependencies": {
    "next": "16.1.2"
  },
  "devDependencies": {
    "babel-plugin-react-compiler": "1.0.0"
  }
}
```

## Tailwind 4

Tailwind 4 uses CSS-based configuration with `@import`:

```css
/* global.css */
@import 'tailwindcss';

body {
  background-color: #111;
  color: #eee;
}

html,
body,
#__next,
canvas {
  height: 100%;
  width: 100%;
}
```

Dependencies:

```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "4.1.18",
    "postcss": "8.5.6",
    "tailwindcss": "4.1.18"
  }
}
```

No `tailwind.config.js` needed - Tailwind 4 uses CSS-first configuration.

## Prettier

```js
// prettier.config.js
/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  plugins: ['prettier-plugin-tailwindcss'],
}
```

Dependencies:

```json
{
  "devDependencies": {
    "prettier-plugin-tailwindcss": "0.7.2"
  }
}
```

## TypeScript

No `src/` folder - files live at the root. Use `@/` for absolute imports:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

Import example:

```tsx
import { Navigation } from '@/components/Navigation'
```

No need to create tsconfig.json manually. Run `bun run build` and Next.js will create it. Add the `@/` paths to the generated file.

Dependencies:

```json
{
  "devDependencies": {
    "@types/node": "25.0.9",
    "typescript": "5.9.3"
  }
}
```

## Bun

Use Bun as package manager and runtime. Scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "serve out"
  },
  "devDependencies": {
    "serve": "14.2.5"
  }
}
```

## Miniplex ECS

Miniplex is the preferred ECS for core game logic. It's minimalistic, has great TypeScript support, and React bindings.

Dependencies:

```json
{
  "dependencies": {
    "miniplex": "2.0.0",
    "miniplex-react": "2.0.1"
  }
}
```

See the `miniplex` and `verekia-miniplex` skill for usage details.

## Zustand Stores

Zustand is used for state that doesn't belong in the ECS, like UI state and user preferences.

**Important**: The three stores (core-store, ui-store, local-store) must always be set up as boilerplate in every project, even if the initial feature doesn't require them. They are part of the standard project structure.

Dependencies:

```json
{
  "dependencies": {
    "zustand": "5.0.10"
  }
}
```

See the `verekia-stores` skill for the store patterns and implementation details.

## Hooks

useReactive, useReactiveSlow (useReactive at 10 fps), useReactiveFast (useReactive at 30fps) must also be implement in lib/hooks.ts.

## Math util

smooth-interpolation functions must be part of lib/math.ts

## Git Ignore

Add this .gitignore:
```
node_modules/
.next/
out/
.DS_Store
.env*.local
*.tsbuildinfo
analyze/
*.blend1
next-env.d.ts
playwright-report/
.last-run.json
```

## Related Skills

Use these skills together with `verekia-setup`:

- `r3f-setup` - Core React Three Fiber dependencies and WebGPU setup
- `verekia-architecture` - Systems vs Views separation, folder structure
- `verekia-model-container` - ModelContainer pattern for Entity/Model separation
- `verekia-miniplex` - Miniplex patterns for rendering entities
- `verekia-stores` - Zustand store patterns (core-store, ui-store, local-store)
- `miniplex` - Core Miniplex API and preferred methods
- `ui-useframe` - Sync UI outside Canvas with render loop
- `smooth-interpolation` - Exponential smoothing for animations
- `reactive-polling` - useReactive hook for polling state changes

---

This skill is part of [verekia](https://x.com/verekia)'s [**r3f-gamedev**](https://github.com/verekia/r3f-gamedev).
