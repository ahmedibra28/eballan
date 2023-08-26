import Image from 'next/image'
import React from 'react'

const AD = () => {
  return (
    <div className="w-100">
      <Image
        src="/ad.png"
        alt="Flight discount advertisement"
        className="w-100 img-fluid"
        width={995}
        height={360}
      />
    </div>
  )
}

export default AD
