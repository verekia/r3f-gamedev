import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber/webgpu'
import { VFXParticles } from 'r3f-vfx'

const R3FVfxPage = () => (
  <>
    <Canvas>
      <VFXParticles debug />
      <OrbitControls />
    </Canvas>
  </>
)

R3FVfxPage.title = 'R3F-VFX'
R3FVfxPage.description = (
  <>
    <a href="https://github.com/mustache-dev/r3f-vfx" target="_blank">
      r3f-vfx
    </a>{' '}
    is a work-in-progress VFX library.
  </>
)

export default R3FVfxPage
