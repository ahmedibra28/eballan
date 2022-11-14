import React from 'react'
import Link from 'next/link'
import { FaUser, FaUserPlus } from 'react-icons/fa'

const Navigation = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark d-flex justify-content-center'>
      <Link href='/'>
        <a className='navbar-brand font-monospace'>e-Ballan</a>
      </Link>
    </nav>
  )
}

export default Navigation
