import Meta from '@/components/Meta'
import './globals.css'
// import { Indie_Flower } from 'next/font/google'
import Providers from '@/lib/provider'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'

// const indie_flower = Indie_Flower({
//   subsets: ['latin'],
//   weight: ['400'],
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
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, user-scalable=no'
        />
      </head>
      <body
        // className={indie_flower.className}
        suppressHydrationWarning={true}
      >
        <Providers>
          <Navigation />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
