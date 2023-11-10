'use client'

import React from 'react'

export default function Steps({ current = 0 }: { current: number }) {
  return (
    <ul className='steps w-full mb-5'>
      <li
        className={`text-gray-500 step ${current >= 0 ? 'step-primary' : ''}`}
      >
        Choose flight
      </li>
      <li
        className={`text-gray-500 step ${current >= 1 ? 'step-primary' : ''}`}
      >
        Passenger details
      </li>
      <li
        className={`text-gray-500 step ${current >= 2 ? 'step-primary' : ''}`}
      >
        Trip summary
      </li>
      <li
        className={`text-gray-500 step ${current >= 3 ? 'step-primary' : ''}`}
      >
        Payment
      </li>
    </ul>
  )
}
