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

const SEGMENT_COUNT = 20
const FADE_DURATION = 0.3

// ⚠️ Vibe coded

const createTrailGeometry = (pointCount: number) => {
  const geometry = new BufferGeometry()
  const vertexCount = pointCount * SEGMENT_COUNT

  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertexCount * 3), 3))

  const uvs = new Float32Array(vertexCount * 2)
  for (let segment = 0; segment < SEGMENT_COUNT; segment++) {
    for (let point = 0; point < pointCount; point++) {
      const index = (segment * pointCount + point) * 2
      uvs[index] = point / (pointCount - 1) // u: 0 at base, 1 at tip
      uvs[index + 1] = segment / SEGMENT_COUNT // v: 0 at newest, 1 at oldest
    }
  }
  geometry.setAttribute('uv', new BufferAttribute(uvs, 2))

  const indices: number[] = []
  for (let segment = 0; segment < SEGMENT_COUNT - 1; segment++) {
    for (let point = 0; point < pointCount - 1; point++) {
      const topLeft = segment * pointCount + point
      const topRight = topLeft + 1
      const bottomLeft = (segment + 1) * pointCount + point
      const bottomRight = bottomLeft + 1
      indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight)
    }
  }
  geometry.setIndex(indices)

  return geometry
}

const Trail = ({
  target,
  points,
  enabled,
}: {
  target: React.RefObject<Group | null>
  points: Vector3[]
  enabled: boolean
}) => {
  const meshRef = useRef<Mesh<BufferGeometry, MeshBasicMaterial>>(null)
  const [visible, setVisible] = useState(true)

  const alphaMap = useLoader(TextureLoader, '/trail-gradient.png')
  alphaMap.flipY = false

  const { geometry, history, tempVectors, ringIndex, opacity } = useMemo(() => {
    const geo = createTrailGeometry(points.length)
    // Pre-allocate history as a ring buffer of Vector3 arrays
    const hist = Array.from({ length: SEGMENT_COUNT }, () => points.map(() => new Vector3()))
    // Reusable vectors for world position calculations
    const temps = points.map(() => new Vector3())
    return {
      geometry: geo,
      history: hist,
      tempVectors: temps,
      ringIndex: { current: 0 },
      opacity: { current: 1 },
    }
  }, [points])

  useEffect(() => {
    if (enabled) {
      ringIndex.current = 0
      opacity.current = 1
      // Reset all history positions
      for (const segment of history) {
        for (const vec of segment) {
          vec.set(0, 0, 0)
        }
      }
      setVisible(true)
    }
  }, [enabled, history, ringIndex, opacity])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    const targetGroup = target.current
    if (!mesh || !targetGroup) return

    if (!enabled) {
      opacity.current = Math.max(0, opacity.current - delta / FADE_DURATION)
      mesh.material.opacity = opacity.current
      if (opacity.current <= 0) {
        setVisible(false)
        return
      }
    }

    // Calculate current world positions using pre-allocated vectors
    for (let i = 0; i < points.length; i++) {
      tempVectors[i].copy(points[i])
      targetGroup.localToWorld(tempVectors[i])
    }

    // Store in ring buffer (newest at ringIndex)
    const currentSegment = history[ringIndex.current]
    for (let i = 0; i < points.length; i++) {
      currentSegment[i].copy(tempVectors[i])
    }
    ringIndex.current = (ringIndex.current + 1) % SEGMENT_COUNT

    // Update geometry: segment 0 = oldest, segment N-1 = newest
    const positions = mesh.geometry.attributes.position
    for (let segment = 0; segment < SEGMENT_COUNT; segment++) {
      const historyIndex = (ringIndex.current + segment) % SEGMENT_COUNT
      const historySegment = history[historyIndex]
      for (let point = 0; point < points.length; point++) {
        const pos = historySegment[point]
        positions.setXYZ(segment * points.length + point, pos.x, pos.y, pos.z)
      }
    }
    positions.needsUpdate = true
  }, -1) // Run before render

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
