import React from 'react'
import SearchForm from '../SearchForm'
import { Indie_Flower } from 'next/font/google'
// import AD from './Ad'

const indie_flower = Indie_Flower({
  subsets: ['latin'],
  weight: ['400'],
})

export default function Hero() {
  return (
    <>
      <div
        style={{
          height: 'calc(100vh - 68px)',
          background:
            'linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.2)), url(https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className='flex flex-col justify-center items-center'
        // className='sm:-mx-4 lg:mx-0 md:-mt-4 lg:mt-0 flex flex-col justify-center items-center'
      >
        {/* <div className='absolute top-[37px] sm:top-[55px] lg:top-[40px] 2xl:top-[64px] left-0 right-0 w-full mx-auto flex justify-center'>
          <AD />
        </div> */}

        <h1
          className={`text-3xl md:text-4xl text-center lg:text-7xl font-thin text-white mb-5 duration-1000 ${indie_flower.className}`}
        >
          Nimaan Dhulmarin Dhaayo Maleh
        </h1>
        <SearchForm source='home' />
      </div>
    </>
  )
}
