# Camera Shake

Shake the camera when the player takes damage or on impacts for visual feedback.

## Technique

Instantly offset the camera's rotation on X (pitch) and Z (roll) axes, then smoothly return to the base rotation using exponential decay in `useFrame`.

## Key Concepts

- Store rotation offsets in a module-level object for external triggering
- Use exponential smoothing: `(target - current) * (1 - Math.exp(-speed * dt))`
- Apply offsets to `camera.rotation.x` and `camera.rotation.z`
- Call `shake(intensity)` from anywhere to trigger the effect

## Usage

```tsx
const shake = (intensity = 0.05) => {
  rotationOffset.x = (Math.random() - 0.5) * intensity
  rotationOffset.z = (Math.random() - 0.5) * intensity
}

// In useFrame:
rotationOffset.x += addSmoothExp(rotationOffset.x, 0, 10, delta)
camera.rotation.x = rotationOffset.x
```
