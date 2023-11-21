import Meta from '@/components/Meta'
import './globals.css'
// import { Roboto } from 'next/font/google'
import Providers from '@/lib/provider'
import Footer from '@/components/Footer'
import ContentSwitcher from '@/components/ContentSwitcher'

// const roboto = Roboto({
//   subsets: ['latin'],
//   weight: ['100', '300', '500', '700', '900'],
// })

export const metadata = {
  ...Meta({}),
}

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
          <ContentSwitcher>{children}</ContentSwitcher>
          {/* <Footer /> */}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
