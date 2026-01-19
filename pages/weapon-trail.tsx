import { OrbitControls } from '@react-three/drei/core'
import { Canvas, useFrame, useLoader } from '@react-three/fiber/webgpu'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  Vector3,
} from 'three'

const SEGMENTS = 20
const FADE_DURATION = 0.3

// ⚠️ This one was vibe-coded

const Trail = ({
  target,
  points,
  enabled,
}: {
  target: React.RefObject<Group | null>
  points: Vector3[]
  enabled: boolean
}) => {
  const meshRef = useRef<Mesh>(null)
  const history = useRef<Vector3[][]>([])
  const opacity = useRef(1)
  const [visible, setVisible] = useState(true)

  const alphaMap = useLoader(TextureLoader, '/trail-gradient.png')
  alphaMap.flipY = false

  // Reset when re-enabled
  useEffect(() => {
    if (enabled) {
      history.current = []
      opacity.current = 1
      setVisible(true)
    }
  }, [enabled])

  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const numPts = points.length

    // Position attribute (will be updated each frame)
    geo.setAttribute('position', new BufferAttribute(new Float32Array(numPts * SEGMENTS * 3), 3))

    // UVs for gradient texture (v = 0 at tip, v = 1 at tail)
    const uvs = new Float32Array(numPts * SEGMENTS * 2)
    for (let seg = 0; seg < SEGMENTS; seg++) {
      for (let pt = 0; pt < numPts; pt++) {
        const i = (seg * numPts + pt) * 2
        uvs[i] = pt / (numPts - 1)
        uvs[i + 1] = seg / SEGMENTS
      }
    }
    geo.setAttribute('uv', new BufferAttribute(uvs, 2))

    // Triangle indices connecting segments
    const indices: number[] = []
    for (let seg = 0; seg < SEGMENTS - 1; seg++) {
      for (let pt = 0; pt < numPts - 1; pt++) {
        const a = seg * numPts + pt
        const b = a + 1
        const c = (seg + 1) * numPts + pt
        const d = c + 1
        indices.push(a, c, b, b, c, d)
      }
    }
    geo.setIndex(indices)

    return geo
  }, [points.length])

  useFrame((_, delta) => {
    if (!target.current || !meshRef.current) return

    // Fade out while still following
    if (!enabled) {
      opacity.current = Math.max(0, opacity.current - delta / FADE_DURATION)
      ;(meshRef.current.material as MeshBasicMaterial).opacity = opacity.current
      if (opacity.current <= 0) {
        setVisible(false)
        return
      }
    }

    // Get current world positions of trail points
    const current = points.map(p => target.current!.localToWorld(p.clone()))

    // Initialize history with current position
    if (history.current.length === 0) {
      for (let i = 0; i < SEGMENTS; i++) history.current.push(current.map(p => p.clone()))
    }

    // Shift history and add new position
    history.current.shift()
    history.current.push(current)

    // Update geometry vertices
    const positions = meshRef.current.geometry.attributes.position
    for (let seg = 0; seg < SEGMENTS; seg++) {
      for (let pt = 0; pt < points.length; pt++) {
        const pos = history.current[seg][pt]
        positions.setXYZ(seg * points.length + pt, pos.x, pos.y, pos.z)
      }
    }
    positions.needsUpdate = true
  }, -1)

  if (!visible) return null

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color="cyan" transparent side={DoubleSide} depthWrite={false} alphaMap={alphaMap} />
    </mesh>
  )
}

const trailPoints = [new Vector3(0, 0, 0), new Vector3(0, 1.5, 0)]

const Stick = ({ trailEnabled }: { trailEnabled: boolean }) => {
  const ref = useRef<Group>(null)

  useFrame(({ elapsed }) => {
    if (!ref.current) return
    ref.current.rotation.y = Math.sin(elapsed * 2) * 3
    ref.current.rotation.z = Math.cos(elapsed * 2) * 1.5
  })

  return (
    <>
      <group ref={ref}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
      <Trail target={ref} points={trailPoints} enabled={trailEnabled} />
    </>
  )
}

const WeaponTrailPage = () => {
  const [trailEnabled, setTrailEnabled] = useState(true)

  return (
    <>
      <button
        onClick={() => setTrailEnabled(e => !e)}
        className="absolute top-4 right-4 z-10 rounded bg-white px-3 py-1 text-black"
      >
        {trailEnabled ? 'Disable' : 'Enable'} Trail
      </button>
      <Canvas camera={{ position: [0, 0, 7] }}>
        <Stick trailEnabled={trailEnabled} />
        <OrbitControls />
      </Canvas>
    </>
  )
}

WeaponTrailPage.title = 'Weapon Trail'
WeaponTrailPage.description = 'A ribbon trail using BufferGeometry that follows movement.'

export default WeaponTrailPage
