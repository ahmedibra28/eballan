import Image from 'next/image'
import React from 'react'

const AD = () => {
  return (
    <div className='w-full mx-auto'>
      <Image
        src='/haboon.jpg'
        alt='Flight discount advertisement'
        className='w-[1500px] xl:w-[2000px] xl:h-[200px] h-[90px] md:h-[150px] object-contain'
        width={1000}
        height={500}
        quality={100}
      />
    </div>
  )
}

export default AD
