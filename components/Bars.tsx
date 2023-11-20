'use client'
import useUserInfoStore from '@/zustand/userStore'
import React from 'react'
import { FaBars } from 'react-icons/fa6'

export default function Bars() {
  const { userInfo } = useUserInfoStore((state) => state)
  if (!userInfo.token) return <></>
  return (
    <label
      htmlFor='my-drawer-2'
      className='btn btn-ghost drawer-button md:hidden'
    >
      <FaBars className='text-2xl text-white' />
    </label>
  )
}
