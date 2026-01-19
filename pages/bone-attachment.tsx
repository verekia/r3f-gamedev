import { useAnimations, useGLTF } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei/core'
import { Canvas } from '@react-three/fiber/webgpu'
import { ReactNode, useEffect, useRef } from 'react'
import type { AnimationAction, AnimationClip, Bone, BufferGeometry, Group, Skeleton } from 'three'

type BoneChildProps = {
  bone: Bone | null
  children: ReactNode
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

const BoneChild = ({ bone, children, rotation, position, scale = 1 }: BoneChildProps) => {
  const containerRef = useRef<Group>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!bone || !container) return

    bone.add(container)
    return () => {
      bone.remove(container)
    }
  }, [bone])

  return (
    <group ref={containerRef} rotation={rotation} position={position} scale={scale}>
      {children}
    </group>
  )
}

type Nodes = {
  Character: { geometry: BufferGeometry; skeleton: Skeleton }
  Root: Bone
  HandR: Bone
  IKLegPoleL: Bone
  IKLegTargetL: Bone
  IKLegPoleR: Bone
  IKLegTargetR: Bone
}

const Character = () => {
  const { animations, nodes } = useGLTF('/character.glb') as unknown as { animations: AnimationClip[]; nodes: Nodes }
  const ref = useRef<Group>(null)
  const { actions } = useAnimations(animations, ref) as unknown as { actions: { Run: AnimationAction } }

  useEffect(() => {
    actions.Run.play()
  }, [actions])

  return (
    <group ref={ref} scale={0.4} position-y={-1.3} rotation-y={0.5} dispose={null}>
      <primitive object={nodes.Root} />
      <primitive object={nodes.IKLegPoleL} />
      <primitive object={nodes.IKLegTargetL} />
      <primitive object={nodes.IKLegPoleR} />
      <primitive object={nodes.IKLegTargetR} />

      <skinnedMesh geometry={nodes.Character.geometry} skeleton={nodes.Character.skeleton}>
        <meshBasicMaterial color="#ccc" />
      </skinnedMesh>

      <BoneChild bone={nodes.HandR}>
        <mesh position={[0, 0.3, 2]} scale={[0.3, 0.3, 4]}>
          <boxGeometry />
          <meshBasicMaterial color="red" />
        </mesh>
      </BoneChild>
    </group>
  )
}

const BoneAttachmentPage = () => (
  <>
    <Canvas className="h-full">
      <Character />
      <OrbitControls />
    </Canvas>
  </>
)

BoneAttachmentPage.title = 'Bone Attachment'
BoneAttachmentPage.description =
  "Attach meshes to bones such as a sword to a character's hand. This uses a simple BoneChild component helper."

export default BoneAttachmentPage
