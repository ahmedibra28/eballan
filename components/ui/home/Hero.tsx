import React from 'react'
import SearchForm from '../SearchForm'

export default function Hero() {
  return (
    <>
      <div
        style={{
          height: 'calc(100vh - 68px)',
          background:
            'linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1569629743817-70d8db6c323b?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className='-m-4 flex flex-col justify-center items-center'
      >
        <h1 className='text-3xl md:text-4xl lg:text-7xl font-extrabold text-white mb-5 duration-1000'>
          Nimaan Dhulmarin Dhaayo Maleh
        </h1>
        <SearchForm source='home' />
      </div>
    </>
  )
}