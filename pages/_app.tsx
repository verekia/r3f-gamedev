import { useRouter } from 'next/router'
import { Navigation } from '../components/Navigation'
import '../global.css'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <Navigation defaultOpen={router.pathname === '/'} />
      <Component {...pageProps} />
    </>
  )
}
