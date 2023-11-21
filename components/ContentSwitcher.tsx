'use client'

import React from 'react'
import Sidebar from './Sidebar'
import Navigation from './Navigation'
import Image from 'next/image'
import Link from 'next/link'
import Bars from './Bars'

export default function ContentSwitcher({ children }: any) {
  return (
    <>
      <div className='navbar bg-my-primary z-50 mb-0 md:mb-4'>
        <div className='flex-1'>
          <Bars />
          <Link href='/' className='btn btn-ghost w-auto normal-case text-xl'>
            <Image src={'/logo.png'} width={150} height={40} alt='logo' />
          </Link>
        </div>
        <Navigation />
      </div>
      <div className='min-h-[91vh]'>
        <div className='flex md:hidden'>
          <Sidebar>
            <main>{children}</main>
          </Sidebar>
        </div>
        <main className='hidden md:block'>{children}</main>
      </div>
    </>
  )
}
