import React from 'react'
// import PhotoAlbum from 'react-photo-album'

import Image from 'next/image'
// import type { PhotoProps } from "react-photo-album";

// const NextJsImage = ({
//   imageProps: { src, alt, title, sizes, className, onClick },
//   wrapperStyle,
// }) => (
//   <div style={wrapperStyle}>
//     <div
//       style={{
//         display: 'block',
//         position: 'relative',
//         width: '100%',
//         height: '100%',
//       }}
//     >
//       <Image
//         style={{ objectFit: 'contain' }}
//         width={250}
//         height={150}
//         // fill
//         src={src}
//         alt={alt}
//         title={title}
//         sizes={sizes}
//         className={className}
//         onClick={onClick}
//       />
//     </div>
//   </div>
// )

const Destinations = () => {
  const photos = [
    { city: 'Mogadishu', src: '/cities/mogadishu.png' },
    { city: 'Hargeisa', src: '/cities/hargeisa.png' },
    { city: 'Bosaso', src: '/cities/bosaso.png' },
    { city: 'Kismayu', src: '/cities/kismayo.png' },
    { city: 'Baladweyn', src: '/cities/baladweyn.png' },
    { city: 'Dhusamareb', src: '/cities/dhusamareb.png' },
    { city: 'Baidoa', src: '/cities/baidabo.png' },
    { city: 'D. Jabuti', src: '/cities/jabuti.png' },
  ]
  return (
    <div className="container my-5">
      <h2 className="fw-bold text-primary">
        {/* Popular destinations from Mogadishu */}
        Trending Destinations
      </h2>
      <p>These alluring destinations from Mogadishu are picked just for you.</p>

      {/* <PhotoAlbum
        layout="columns"
        photos={photos}
        columns={4}
        renderPhoto={NextJsImage}
      /> */}

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
