import { useEffect, useRef } from 'react'

const pages = [
  { name: 'CSS Health Bars', href: '/css-health-bars' },
  { name: 'Smooth Interpolation', href: '/smooth-interpolation' },
  { name: 'Bone Attachment', href: '/bone-attachment' },
  { name: 'Camera Shake', href: '/camera-shake' },
  { name: 'Weapon Trail', href: '/weapon-trail' },
  { name: 'Zustand Entities', href: '/zustand-entities' },
  { name: 'Reactive Polling', href: '/reactive-polling' },
  { name: 'UI useFrame', href: '/ui-useframe' },
]

export const Navigation = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (defaultOpen) {
      dialogRef.current?.showModal()
    }
  }, [defaultOpen])

  const openDialog = () => {
    dialogRef.current?.showModal()
  }

  const closeDialog = () => {
    dialogRef.current?.close()
  }

  return (
    <>
      <button
        onClick={openDialog}
        className="fixed top-4 left-4 z-[1000] flex cursor-pointer flex-col gap-1 rounded-lg border-none bg-black/70 p-3"
        aria-label="Open navigation"
      >
        <span className="block h-0.5 w-5 rounded-sm bg-white" />
        <span className="block h-0.5 w-5 rounded-sm bg-white" />
        <span className="block h-0.5 w-5 rounded-sm bg-white" />
      </button>

      <dialog
        ref={dialogRef}
        className="h-screen max-h-screen w-screen max-w-[100vw] border-none bg-transparent p-0"
        onClick={e => e.target === dialogRef.current && closeDialog()}
      >
        <div className="fixed top-0 left-0 box-border h-screen w-[250px] bg-[#000000] p-5 text-white">
          <button
            onClick={closeDialog}
            className="absolute top-3 right-3 cursor-pointer border-none bg-transparent p-1 text-xl outline-none"
            aria-label="Close navigation"
          >
            ✕
          </button>
          <nav className="mt-10">
            <ul className="m-0 list-none p-0">
              {pages.map(page => (
                <li key={page.href} className="mb-3">
                  <a href={page.href} className="block py-2 text-lg no-underline">
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  )
}
