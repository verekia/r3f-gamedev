import { useEffect, useRef } from 'react'

const sections = [
  {
    title: 'Visuals',
    pages: [
      { name: 'CSS Health Bars', href: '/css-health-bars' },
      { name: 'Camera Shake', href: '/camera-shake' },
      { name: 'Weapon Trail', href: '/weapon-trail' },
    ],
  },

  {
    title: 'Techniques',
    pages: [
      { name: 'Bone Attachment', href: '/bone-attachment' },
      { name: 'Smooth Interpolation', href: '/smooth-interpolation' },
      { name: 'Reactive Polling', href: '/reactive-polling' },
      { name: 'UI useFrame', href: '/ui-useframe' },
    ],
  },
  {
    title: 'ECS / Entities',
    pages: [
      { name: 'Koota', href: '/koota' },
      { name: 'Miniplex', href: '/miniplex' },
      { name: 'Zustand', href: '/zustand' },
    ],
  },
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
            {sections.map(section => (
              <div key={section.title} className="mb-5">
                <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">{section.title}</h3>
                <ul className="m-0 list-none">
                  {section.pages.map(page => (
                    <li key={page.href} className="mb-0">
                      <a href={page.href} className="block text-lg no-underline">
                        {page.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </dialog>
    </>
  )
}
