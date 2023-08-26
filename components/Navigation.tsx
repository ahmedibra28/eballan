import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FaSignInAlt, FaPowerOff } from 'react-icons/fa'
import { userInfo } from '../api/api'
import { IClientPermission } from '../models/ClientPermission'

const Logout = () => {
  typeof window !== undefined && localStorage.removeItem('userRole')
  return typeof window !== undefined && localStorage.removeItem('userInfo')
}

const Navigation = () => {
  const logoutHandler = () => {
    Logout()
  }

  const guestItems = () => {
    return (
      <>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle text-light"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Bookings
            </a>
            <ul className="dropdown-menu bg-primary">
              <li className="nav-item text-light">
                <Link
                  href="/reservations/ticket-pdf"
                  className="dropdown-item text-light btn btn-warning px-3 rounded-0"
                  aria-current="page"
                >
                  My Ticket
                </Link>
              </li>
              <li className="nav-item text-light">
                <Link
                  href="/reservations/cancellation"
                  className="dropdown-item text-light btn btn-warning px-3 rounded-0"
                  aria-current="page"
                >
                  Cancellation
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link
              href="/auth/login"
              className="nav-link text-light btn btn-warning px-3 rounded-0"
              aria-current="page"
            >
              <FaSignInAlt className="mb-1" /> Login
            </Link>
          </li>
        </ul>
      </>
    )
  }

  const menus = () => {
    const dropdownItems = userInfo()?.userInfo?.routes?.map(
      (route: IClientPermission) => ({
        menu: route.menu,
        sort: route.sort,
      })
    )

    const menuItems = userInfo()?.userInfo?.routes?.map(
      (route: IClientPermission) => route
    )

    const dropdownArray = dropdownItems?.filter(
      (item: IClientPermission) =>
        item?.menu !== 'hidden' && item?.menu !== 'normal'
    )

    const uniqueDropdowns = dropdownArray?.reduce((a: any[], b: any) => {
      const i = a.findIndex((x: IClientPermission) => x.menu === b.menu)
      return (
        i === -1 ? a.push({ menu: b.menu, ...b, times: 1 }) : a[i].times++, a
      )
    }, [])

    return {
      uniqueDropdowns: uniqueDropdowns?.sort(
        (a: { sort: number }, b: { sort: number }) => b?.sort - a?.sort
      ),
      menuItems: menuItems?.sort(
        (a: { sort: number }, b: { sort: number }) => b?.sort - a?.sort
      ),
    }
  }

  useEffect(() => {
    menus()
  }, [])

  const authItems = () => {
    return (
      <>
        <ul className="navbar-nav ms-auto">
          {menus()?.menuItems?.map(
            (menu: IClientPermission, index: number) =>
              menu.menu === 'normal' && (
                <li key={index} className="nav-item">
                  <Link
                    href={menu.path}
                    className="nav-link text-light"
                    aria-current="page"
                  >
                    {menu.name}
                  </Link>
                </li>
              )
          )}

          {menus()?.uniqueDropdowns?.map(
            (item: IClientPermission, index: number) => (
              <li key={index} className="nav-item dropdown">
                <a
                  className="nav-link text-light dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {item?.menu === 'profile'
                    ? userInfo()?.userInfo?.name
                    : item?.menu.charAt(0).toUpperCase() +
                      item?.menu.substring(1)}
                </a>
                <ul
                  className="dropdown-menu border-0"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {menus() &&
                    menus().menuItems.map(
                      (menu: IClientPermission, index: number) =>
                        menu.menu === item?.menu && (
                          <li key={index}>
                            <Link href={menu.path} className="dropdown-item">
                              {menu.name}
                            </Link>
                          </li>
                        )
                    )}
                </ul>
              </li>
            )
          )}

          <li className="nav-item">
            <Link
              href="/auth/login"
              className="nav-link text-light"
              aria-current="page"
              onClick={logoutHandler}
            >
              <FaPowerOff className="mb-1" /> Logout
            </Link>
          </li>
        </ul>
      </>
    )
  }

  return (
    <div className="bg-primary pb-5">
      <nav className="navbar navbar-expand-md navbar-light bg-primary mb-0">
        <div className="container mt-3">
          <Link href="/">
            <Image
              priority
              width={150}
              height={40}
              src="/logo.png"
              className="img-fluid"
              alt="logo"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {userInfo()?.userInfo ? authItems() : guestItems()}
          </div>
        </div>
      </nav>
      {/* <hr className="text-light" /> */}
      {/* <div className="container text-center">
        <button className="btn btn-light">
          <FaPlaneDeparture className="mb-1 me-2" />
          Flights
        </button>
        <button className="btn btn-outline-light border-0 ms-1">
          <FaHospitalAlt className="mb-1 me-2" />
          Hospital
        </button>
      </div> */}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })
