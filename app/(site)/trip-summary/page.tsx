'use client'
import Steps from '@/components/ui/Steps'
import usePassengerStore from '@/zustand/usePassengerStore'
import React from 'react'

export default function Page() {
  const { passenger } = usePassengerStore((state) => state)
  return (
    <div className='max-w-7xl mx-auto'>
      <Steps current={2} />
      Page {passenger?.contact?.email}
    </div>
  )
}
