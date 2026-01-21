---
name: project-setup
description: Set up a React Three Fiber project with WebGPU support.
---

# Project Setup

Set up a React Three Fiber project with WebGPU support using Next.js, React 19, and Three.js TSL.

## Dependencies

Core dependencies for R3F with WebGPU:

```json
{
  "dependencies": {
    "@react-three/drei": "11.0.0-alpha.4",
    "@react-three/fiber": "10.0.0-alpha.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "three": "0.182.0"
  },
  "devDependencies": {
    "@types/three": "0.182.0"
  }
}
```

## Canvas Setup

Import Canvas from the WebGPU entry point:

```tsx
import { Canvas } from '@react-three/fiber/webgpu'

const Page = () => (
  <Canvas>
    <mesh>
      <boxGeometry />
      <meshBasicMaterial color="red" />
    </mesh>
  </Canvas>
)
```

## TSL Shaders

For custom shaders, use Three.js TSL (Three Shading Language):

```tsx
import { Fn, vec3, sin, time } from 'three/tsl'
```

Use node materials like `meshBasicNodeMaterial` for TSL integration.

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

Pages go in `pages/` directory. Each file becomes a route.

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

## Required Patches (Bun)

Three.js 0.182.0 and detect-gpu require patches for WebGPU/SSR compatibility. Add to `package.json`:

```json
{
  "patchedDependencies": {
    "three@0.182.0": "patches/three@0.182.0.patch",
    "detect-gpu@5.0.70": "patches/detect-gpu@5.0.70.patch"
  },
  "overrides": {
    "three": "0.182.0"
  }
}
```

Create `patches/three@0.182.0.patch` (fixes GPUShaderStage SSR error):

```patch
diff --git a/build/three.webgpu.js b/build/three.webgpu.js
index 31ff163d67f4cc5dec060a11bc7151c64f949fd9..823c1c35bca5411a27cbf52c5c3a188001fe0445 100644
--- a/build/three.webgpu.js
+++ b/build/three.webgpu.js
@@ -70604,7 +70604,7 @@ const GPUPrimitiveTopology = {
 	TriangleStrip: 'triangle-strip',
 };

-const GPUShaderStage = ( typeof self !== 'undefined' ) ? self.GPUShaderStage : { VERTEX: 1, FRAGMENT: 2, COMPUTE: 4 };
+const GPUShaderStage = ( typeof self !== 'undefined' && self.GPUShaderStage ) ? self.GPUShaderStage : { VERTEX: 1, FRAGMENT: 2, COMPUTE: 4 };

 const GPUCompareFunction = {
 	Never: 'never',
```

Create `patches/detect-gpu@5.0.70.patch` (adds missing exports field):

```patch
diff --git a/package.json b/package.json
index 22ffa92b457c0d83c052eab3f1961110d134d1b3..4f5f9ef7a8a80d6f85e3e5b241a87091d95bbe39 100644
--- a/package.json
+++ b/package.json
@@ -7,6 +7,12 @@
   "main": "dist/detect-gpu.umd.js",
   "module": "dist/detect-gpu.esm.js",
   "types": "dist/src/index.d.ts",
+  "exports": {
+    ".": {
+      "import": "./dist/detect-gpu.esm.js",
+      "require": "./dist/detect-gpu.umd.js"
+    }
+  },
   "homepage": "https://github.com/pmndrs/detect-gpu#readme",
   "bugs": {
     "url": "https://github.com/pmndrs/detect-gpu/issues"
```

Run `bun install` to apply patches.

## Key Notes

- R3F v10 and Drei v11 are currently in alpha for WebGPU support
- Use `three-stdlib` for additional utilities
- React Compiler is recommended with React 19
- The `overrides` field ensures consistent Three.js versions across dependencies
