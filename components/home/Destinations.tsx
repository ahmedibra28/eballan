import React from 'react'

import Image from 'next/image'

const Destinations = () => {
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
    <div className="container my-5">
      <h2 className="fw-bold text-primary">Trending Destinations</h2>
      <p>These alluring destinations from Mogadishu are picked just for you.</p>

      <div className="row gy-3">
        {photos?.map((photo, i: number) => (
          <div key={i} className="col-lg-3 col-md-4 col-6 position-relative">
            <Image
              src={photo.src}
              alt="destination"
              className="w-100 rounded-5"
              style={{ objectFit: 'cover' }}
              width={300}
              height={300}
            />
            <h2
              className="position-absolute text-light fw-bold"
              style={{
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {photo.city}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Destinations
