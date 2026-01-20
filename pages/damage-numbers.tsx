import { Html, OrbitControls } from '@react-three/drei/core'
import { Canvas, useFrame } from '@react-three/fiber/webgpu'
import { useRef, useState } from 'react'

const { random, floor } = Math

type DamageNumber = {
  id: number
  value: number
  isCrit: boolean
  x: number
  y: number
}

let nextId = 0

const DamageNumbers = () => {
  const [damages, setDamages] = useState<DamageNumber[]>([])
  const timerRef = useRef(0)

  useFrame((_, delta) => {
    timerRef.current += delta
    if (timerRef.current > 0.3) {
      timerRef.current = 0
      const isCrit = random() < 0.2
      const baseValue = floor(random() * 100) + 10
      const newDamage: DamageNumber = {
        id: nextId++,
        value: isCrit ? baseValue * 2 : baseValue,
        isCrit,
        x: random() * 4 - 2,
        y: random() * 2 - 1,
      }
      setDamages(prev => [...prev, newDamage])
      setTimeout(() => {
        setDamages(prev => prev.filter(d => d.id !== newDamage.id))
      }, 1500)
    }
  })

  return (
    <>
      {damages.map(damage => (
        <Html key={damage.id} center position={[damage.x, damage.y, 0]}>
          <div
            className="pointer-events-none flex flex-col items-center whitespace-nowrap text-center text-white"
            style={{
              textShadow:
                '0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black',
              animation: 'damageNumber 1.3s ease-out forwards',
            }}
          >
            <div
              className={damage.isCrit ? 'text-5xl font-bold' : 'text-3xl font-bold'}
            >
              {damage.value}
            </div>
            {damage.isCrit && (
              <div className="-mt-1 text-4xl font-bold text-red-500">CRIT</div>
            )}
          </div>
        </Html>
      ))}
    </>
  )
}

const DamageNumbersPage = () => (
  <>
    <Canvas className="bg-neutral-700">
      <DamageNumbers />
    </Canvas>
  </>
)

DamageNumbersPage.title = 'Damage Numbers'
DamageNumbersPage.description =
  'Use Drei Html to render floating damage numbers with CSS animations.'

export default DamageNumbersPage
