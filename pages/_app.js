import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap')
      : null
  }, [])
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
