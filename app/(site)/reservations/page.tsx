'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { confirmAlert } from 'react-confirm-alert'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import Confirm from '@/components/Confirm'
import { useRouter } from 'next/navigation'
import { CustomSubmitButton } from '@/components/dForms'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import RTable from '@/components/RTable'
import { columns } from './_component/columns'
import useUserInfoStore from '@/zustand/userStore'

const Page = () => {
  const [page, setPage] = useState(1)
  const [airline, setAirline] = useState('')
  const [departureCity, setDepartureCity] = useState('')
  const [arrivalCity, setArrivalCity] = useState('')
  const [agency, setAgency] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [limit, setLimit] = useState(50)

  const path = useAuthorization()
  const router = useRouter()

  const { userInfo } = useUserInfoStore((state) => state)

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['reservations'],
    method: 'GET',
    url: `reservations?page=${page}&limit=${limit}&${new URLSearchParams({
      airline,
      departureCity,
      arrivalCity,
      agency,
      createdAt,
    })}`,
  })?.get

  const deleteApi = useApi({
    key: ['reservations'],
    method: 'DELETE',
    url: `reservations`,
  })?.deleteObj

  useEffect(() => {
    if (deleteApi?.isSuccess) getApi?.refetch()
    // eslint-disable-next-line
  }, [deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Reservations Lists'

  return (
    <div className='mx-auto max-w-7xl'>
      {deleteApi?.isSuccess && (
        <Message variant='success' value={deleteApi?.data?.message} />
      )}
      {deleteApi?.isError && (
        <Message variant='error' value={deleteApi?.error} />
      )}

      <div className='p-3 mt-2 bg-white'>
        <div className='flex flex-col items-center px-2 pb-5 mb-10'>
          <form onSubmit={searchHandler}>
            <hr className='my-2' />
            <div className='flex flex-row flex-wrap items-center justify-center gap-2'>
              <div className='form-control w-full md:w-[48%] lg:w-[32%] mx-auto'>
                <label className='label'>
                  <span className='label-text'>Airline</span>
                </label>
                <input
                  className='border-gray-300 input'
                  type='text'
                  placeholder='Airline name'
                  onChange={(e) => setAirline(e.target.value)}
                  value={airline}
                />
              </div>
              <div className='form-control w-full md:w-[48%] lg:w-[32%] mx-auto'>
                <label className='label'>
                  <span className='label-text'>Departure City</span>
                </label>
                <input
                  className='border-gray-300 input'
                  type='text'
                  placeholder='Departure city name'
                  onChange={(e) => setDepartureCity(e.target.value)}
                  value={departureCity}
                />
              </div>
              <div className='form-control w-full md:w-[48%] lg:w-[32%] mx-auto'>
                <label className='label'>
                  <span className='label-text'>Arrival City</span>
                </label>
                <input
                  className='border-gray-300 input'
                  type='text'
                  placeholder='Arrival name'
                  onChange={(e) => setArrivalCity(e.target.value)}
                  value={arrivalCity}
                />
              </div>
              <div className='form-control w-full md:w-[48%] lg:w-[32%] mx-auto'>
                <label className='label'>
                  <span className='label-text'>Agency</span>
                </label>
                <input
                  className='border-gray-300 input'
                  type='text'
                  placeholder='Agency name'
                  onChange={(e) => setAgency(e.target.value)}
                  value={agency}
                />
              </div>
              <div className='form-control w-full md:w-[48%] lg:w-[32%] mx-auto'>
                <label className='label'>
                  <span className='label-text'>Created At</span>
                </label>
                <input
                  className='border-gray-300 input'
                  type='date'
                  placeholder='Created At'
                  onChange={(e) => setCreatedAt(e.target.value)}
                  value={createdAt}
                />
              </div>
              <div className='form-control mt-auto w-full md:w-[48%] lg:w-[32%] mx-auto'>
                <CustomSubmitButton
                  onClick={searchHandler}
                  isLoading={false}
                  label='Search'
                  type='search'
                  classStyle='btn btn-primary opacity-1 rounded-md'
                  // @ts-ignore
                  iconLeft={<FaMagnifyingGlass />}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant='error' value={getApi?.error} />
      ) : (
        <div className='p-3 mt-2 overflow-x-auto bg-white'>
          <h1 className='text-2xl font-light text-center'>
            {name}
            <sup> [{getApi?.data?.total}] </sup>
          </h1>
          <RTable
            data={getApi?.data}
            columns={columns({
              deleteHandler,
              isLoading: deleteApi?.isPending || false,
              role: userInfo?.role,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            // q={departureCity}
            // setQ={setDepartureCity}
            // searchHandler={searchHandler}
          />
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
