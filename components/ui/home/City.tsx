import Image from 'next/image'
import React from 'react'

export default function City() {
  const photos = [
    { city: 'Mogadishu', src: '/cities/mogadishu.jpg' },
    { city: 'Hargeisa', src: '/cities/hargaisa.jpg' },
    { city: 'Bosaso', src: '/cities/boosaaso.jpg' },
    { city: 'Kismayu', src: '/cities/kismayo.jpg' },
    { city: 'Baladweyn', src: '/cities/beledweyne.jpg' },
    { city: 'Dhusamareb', src: '/cities/dhuusamareeb.jpg' },
    { city: 'Baidoa', src: '/cities/baidao.jpeg' },
    { city: 'D. Jabuti', src: '/cities/djabuti.jpg' },
  ]

  return (
    <div className='flex flex-row flex-wrap justify-between max-w-7xl my-10 mx-auto gap-x-2 gap-y-8'>
      {photos.map((photo, i) => (
        <div
          key={i}
          className='w-[48%] md:w-[31%] lg:w-[24%] mx-auto card bg-my-primary text-white shadow-xl'
        >
          <figure>
            <Image
              src={photo.src}
              width={500}
              height={500}
              className='w-full h-52 object-cover hover:scale-105 duration-1000'
              alt='Shoes'
            />
          </figure>
          <div className='card-body'>
            <h2 className='text-center uppercase'>{photo?.city}</h2>
          </div>
        </div>
      ))}
    </div>
  )
}
