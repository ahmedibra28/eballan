import Navigation from './Navigation'
import Footer from './Footer'
import { ReactNode } from 'react'
import Meta from './Meta'
import { useRouter } from 'next/router'

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  const { asPath } = router

  const route = ['/', '/search-results'].includes(asPath)

  return (
    <div>
      <Meta />
      <Navigation />
      <div className={` ${route ? '' : 'd-flex justify-content-between'} `}>
        <main
          className={`${route ? '' : 'container'} py-2`}
          style={{ minHeight: 'calc(100vh - 120px)' }}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
