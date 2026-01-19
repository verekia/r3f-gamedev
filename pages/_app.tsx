import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import { Navigation } from '../components/Navigation'
import '../global.css'

export type PageWithMeta = NextPage & {
  title?: string
  description?: ReactNode
}

type AppProps = {
  Component: PageWithMeta
  pageProps: Record<string, unknown>
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { title, description } = Component

  return (
    <>
      <Navigation defaultOpen={router.pathname === '/'} />
      <Component {...pageProps} />
      {(title || description) && (
        <div className="fixed right-0 bottom-0 left-0 bg-black/70 p-4">
          {title && <h1 className="text-lg font-bold">{title}</h1>}
          {description && <div className="mt-1 text-sm text-white/70">{description}</div>}
        </div>
      )}
    </>
  )
}
