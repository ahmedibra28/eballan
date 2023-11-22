'use client'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { FaBars } from 'react-icons/fa6'

const Navigation = () => {
  const { userInfo } = useUserInfoStore((state) => state)

  const handleLogout = () => {
    useUserInfoStore.getState().logout()
  }

  const [menu, setMenu] = React.useState<any>(userInfo.menu)

  React.useEffect(() => {
    if (userInfo.id) {
      setMenu(userInfo.menu)
    }
  }, [userInfo])

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // const handleToggle = (item: any) => {
  //   const newMenu = menu.map((x: any) => {
  //     if (x.name === item.name) {
  //       return { ...x, open: !x.open }
  //     }
  //     return { ...x, open: false }
  //   })
  //   setMenu(newMenu)
  // }

  const sharedNav = (
    <>
      <li>
        <details>
          <summary>Bookings</summary>
          <ul
            className='bg-my-primary w-36 rounded'
            style={{ zIndex: 9999999 }}
          >
            <li>
              <Link href='/tickets/my-ticket'>My Ticket</Link>
            </li>
            <li>
              <Link href='/tickets/cancel-ticket'>Cancel Ticket</Link>
            </li>
          </ul>
        </details>
      </li>
    </>
  )

  const guestNav = (
    <>
      <ul className='menu menu-horizontal px-1 hidden md:flex'>
        {sharedNav}
        <li>
          <Link href='/auth/login'>Login</Link>
        </li>
      </ul>

      <div
        suppressHydrationWarning={true}
        className='dropdown dropdown-end md:hidden'
      >
        <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
          <div className='flex justify-center items-center'>
            <FaBars className='text-2xl' />
          </div>
        </label>
        <ul
          tabIndex={0}
          className='mt-3 z-50 p-2 shadow menu menu-sm dropdown-content bg-my-primary rounded w-52'
        >
          {sharedNav}
          <li>
            <Link href='/auth/login'>Login</Link>
          </li>
        </ul>
      </div>
    </>
  )

  const authNav = (
    <>
      <ul className='menu menu-horizontal px-1 hidden md:flex'>
        {menu.map((item: any, i: number) => (
          <Fragment key={i}>
            {!item?.children && (
              <li>
                <Link href={item.path}>{item.name}</Link>
              </li>
            )}

            {item?.children && (
              <li key={item.name}>
                <details>
                  <summary>{capitalizeFirstLetter(item.name)}</summary>
                  <ul className='p-2 bg-my-primary w-44 rounded'>
                    {item.children.map((child: any, i: number) => (
                      <li key={i}>
                        <Link href={child.path}>{child.name}</Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            )}
          </Fragment>
        ))}

        {sharedNav}
      </ul>

      <div suppressHydrationWarning={true} className='dropdown dropdown-end'>
        <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
          <div className='w-10 rounded-full'>
            <Image
              src={
                userInfo.image ||
                `https://ui-avatars.com/api/?uppercase=true&name=${userInfo?.name}`
              }
              width={40}
              height={40}
              alt='profile'
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className='mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-my-primary rounded w-52'
        >
          <li>
            <Link href='/account/profile' className='justify-between'>
              Profile
              <span className='badge'>New</span>
            </Link>
          </li>

          <li>
            <button onClick={() => handleLogout()}>
              <Link href='#'>Logout</Link>
            </button>
          </li>
        </ul>
      </div>
    </>
  )

  return (
    <div className='flex-none text-white'>
      {!userInfo.token && guestNav}

      {userInfo.id && authNav}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })
