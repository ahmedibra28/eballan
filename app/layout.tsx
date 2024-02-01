import Meta from '@/components/Meta'
import './globals.css'
// import { Indie_Flower } from 'next/font/google'
import Providers from '@/lib/provider'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import Script from 'next/script'

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
        <link rel='manifest' href='/manifest.json' />

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_M_ID}`}
          strategy='lazyOnload'
        />
        <Script id='google-analytics' strategy='lazyOnload'>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_M_ID}');
        `}
        </Script>

        {/* <Script id='google-tag-manager' strategy='afterInteractive'>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM}');`}
        </Script> */}
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
