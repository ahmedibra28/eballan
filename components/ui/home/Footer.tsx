'use client'

import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  const partners = [
    { image: '/partners/1.png' },
    { image: '/partners/2.png' },
    { image: '/partners/3.png' },
    { image: '/partners/4.png' },
  ]

  return (
    <>
      <div className='mt-20 bg-white p-12 -mx-4'>
        <div className='flex flex-row flex-wrap justify-between items-center max-w-7xl mx-auto gap-5'>
          {partners.map((partner) => (
            <div
              className='w-[46%] md:w-[30%] lg:w-[23%] mx-auto'
              key={partner.image}
            >
              <Image
                src={partner.image}
                width={500}
                height={500}
                className='w-28 h-28 object-cover mx-auto hover:scale-150 duration-1000'
                alt='Shoes'
              />
            </div>
          ))}
        </div>
      </div>
      <div className='bg-my-primary -mb-4 mt-12 p-12 text-white -mx-4'>
        <div className='mx-auto text-center'>
          <Link href='/privacy-policy' className='text-light'>
            Privacy Policy
          </Link>
          <Link href='/terms-of-use' className='text-light mx-4'>
            Terms of Use
          </Link>

          <Link href='/get-help' className='text-light'>
            Get Help
          </Link>
        </div>
        <hr className='my-10' />

        <div className='text-center'>
          <span> eBallan is a great source</span> <br />
          <span>
            <span className=''>&copy; </span>
            <span className='text-warning'>e</span>Ballan
          </span>
        </div>
      </div>
    </>
  )
}

export default Footer
