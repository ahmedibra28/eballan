import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>eBallan</title>
        <meta name="description" content="Welcome to eBallan" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
      <Image src="/logo.png" alt="eBallan Logo" width={400} height={94} />
      

        <p className={styles.description}>
          This page is down for maintenance
        </p>


      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
