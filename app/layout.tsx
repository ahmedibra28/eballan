import Meta from '@/components/Meta'
import './globals.css'
// import { Roboto } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Providers from '@/lib/provider'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import Bars from '@/components/Bars'

// const roboto = Roboto({
//   subsets: ['latin'],
//   weight: ['100', '300', '500', '700', '900'],
// })

export const metadata = {
  ...Meta({}),
}

const nav = () => (
  <div className='navbar bg-my-primary z-50 mb-0 md:mb-4'>
    <div className='flex-1'>
      <Bars />
      <Link href='/' className='btn btn-ghost w-auto normal-case text-xl'>
        <Image src={'/logo.png'} width={150} height={40} alt='logo' />
      </Link>
    </div>
    <Navigation />
  </div>
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' style={{ background: '#f3f4f6' }}>
      <body
        // className={roboto.className}
        suppressHydrationWarning={true}
      >
        <Providers>
          {nav()}
          <div className='min-h-[91vh]'>
            <div className='flex md:hidden'>
              <Sidebar>
                <main>{children}</main>
              </Sidebar>
            </div>
            <div className='hidden md:block'>
              <main>{children}</main>
            </div>
          </div>
          {/* <Footer /> */}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
