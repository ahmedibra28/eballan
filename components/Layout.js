import Navigation from './Navigation'
import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>eBallan</title>
        <meta property='og:title' content='eBallan' key='title' />
      </Head>
      <Navigation />
      <div className='container py-2'>{children}</div>
    </>
  )
}
