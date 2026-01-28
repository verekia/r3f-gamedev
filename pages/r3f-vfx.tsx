import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber/webgpu'
import { VFXParticles } from 'r3f-vfx'
import { Fn, floor, mix, mod, uv, vec3 } from 'three/tsl'

const checkerboard = Fn(() => {
  const scale = 10
  const coords = floor(uv().mul(scale))
  const checker = mod(coords.x.add(coords.y), 2)
  return mix(vec3(0.2), vec3(0.4), checker)
})

const R3FVfxPage = () => (
  <Canvas className="bg-neutral-700">
    <VFXParticles
      debug
      position={[0, 0, 0]}
      emitCount={12}
      size={[0.1, 0.3]}
      fadeSize={[0.5, 0]}
      colorStart={['#ff0000']}
      colorEnd={['#ffd900']}
      fadeOpacity={[0.87, 0.35]}
      gravity={[0, 0.4, 0]}
      speed={[0.1, 0.1]}
      lifetime={[1, 2]}
      friction={{
        intensity: 0,
        easing: 'linear',
      }}
      direction={[
        [-1, 1],
        [0, 1],
        [-1, 1],
      ]}
      startPosition={[
        [0, 0],
        [0, 0],
        [0, 0],
      ]}
      rotation={[0, 0]}
      rotationSpeed={[0, 0]}
      appearance="gradient"
      blending={1}
      lighting="standard"
      emitterShape={1}
      emitterRadius={[0, 1]}
      emitterAngle={0.7853981633974483}
      emitterHeight={[0, 1]}
      emitterDirection={[0, 1, 0]}
    />
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[5, 5]} />
      <meshBasicNodeMaterial colorNode={checkerboard()} />
    </mesh>
    <OrbitControls maxDistance={3} />
    <ambientLight intensity={3} />
  </Canvas>
)

R3FVfxPage.title = 'R3F-VFX'
R3FVfxPage.description = (
  <>
    <a href="https://github.com/mustache-dev/r3f-vfx" target="_blank">
      r3f-vfx
    </a>{' '}
    is a work-in-progress GPU-accelerated particle system for Three.js WebGPU with React Three Fiber.
  </>
)

export default R3FVfxPage
