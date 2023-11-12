'use client'

import Steps from '@/components/ui/Steps'
import useFlightStore from '@/zustand/useFlightStore'
import usePassengerStore from '@/zustand/usePassengerStore'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const router = useRouter()

  const { flight } = useFlightStore((state) => state)
  const { passenger } = usePassengerStore((state) => state)

  React.useEffect(() => {
    if (!passenger || !flight) return router.back()
  }, [])

  return (
    <div className='max-w-7xl mx-auto'>
      <Steps current={3} />
      payment
    </div>
  )
}
