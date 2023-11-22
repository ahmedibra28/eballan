'use client'

import React from 'react'
import Sidebar from './Sidebar'
import Navigation from './Navigation'
import Image from 'next/image'
import Link from 'next/link'
import Bars from './Bars'
// import { useMediaQuery } from '@uidotdev/usehooks'
import { useMediaQuery } from 'react-responsive'

export default function ContentSwitcher({ children }: any) {
  // const isMediumDevice = useMediaQuery(
  //   'only screen and (min-width : 769px) and (max-width : 992px)'
  // )

  const isMediumDevice = useMediaQuery({
    query: 'only screen and (min-width : 769px) and (max-width : 992px',
  })

  return (
    <>
      <div className='navbar bg-my-primary z-50'>
        <div className='flex-1 z-50'>
          <Bars />
          <Link href='/' className='btn btn-ghost w-auto normal-case text-xl'>
            <Image src={'/logo.png'} width={150} height={40} alt='logo' />
          </Link>
        </div>
        <Navigation />
      </div>
      <div className='min-h-[91vh]'>
        {isMediumDevice ? (
          <Sidebar>
            <main>{children}</main>
          </Sidebar>
        ) : (
          children
        )}
      </div>
    </>
  )
}
