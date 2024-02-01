'use client'

import useUserInfoStore from '@/zustand/userStore'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'

export default function Navigation() {
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

  if (typeof window !== 'undefined') {
    window.addEventListener('click', function (e) {
      document.querySelectorAll('details').forEach(function (dropdown) {
        if (!dropdown.contains(e.target as any)) {
          // Click was outside the dropdown, close it
          dropdown.open = false
        }
      })
    })
  }

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
                  <ul
                    className='p-2 bg-my-primary w-44 rounded'
                    style={{ zIndex: 9999999 }}
                  >
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
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
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

  return (
    <div className='navbar bg-my-primary text-white'>
      <div className='navbar-start'>
        {userInfo?.token && (
          <div className='dropdown'>
            <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h8m-8 6h16'
                />
              </svg>
            </div>

            <ul className='menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-my-primary rounded-box w-52'>
              {menu.map((item: any, i: number) => (
                <Fragment key={i}>
                  {!item?.children && (
                    <li>
                      <Link href={item.path}>{item.name}</Link>
                    </li>
                  )}

                  {item?.children && (
                    <li key={item.name}>
                      <a>{capitalizeFirstLetter(item.name)}</a>
                      <ul
                        className='p-2 bg-my-primary w-44 rounded'
                        style={{ zIndex: 9999999 }}
                      >
                        {item.children.map((child: any, i: number) => (
                          <li key={i}>
                            <Link href={child.path}>{child.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </Fragment>
              ))}
            </ul>
          </div>
        )}

        <Link href='/' className='btn btn-ghost w-auto normal-case text-xl'>
          <Image src={'/logo.png'} width={150} height={40} alt='logo' />
        </Link>
      </div>

      <div className='navbar-end'>
        {userInfo?.token && (
          <div className='navbar-center hidden lg:flex'>{authNav}</div>
        )}

        {!userInfo?.token ? (
          guestNav
        ) : (
          <div
            suppressHydrationWarning={true}
            className='dropdown dropdown-end'
          >
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
              style={{ zIndex: 9999999 }}
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
        )}
      </div>
    </div>
  )
}
