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

## Key Notes

- R3F v10 and Drei v11 are currently in alpha for WebGPU support
- Use `three-stdlib` for additional utilities
- React Compiler is recommended with React 19
- The `overrides` field ensures consistent Three.js versions across dependencies
