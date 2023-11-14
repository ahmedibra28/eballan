'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { confirmAlert } from 'react-confirm-alert'
import { FaEllipsis, FaMagnifyingGlass, FaTrash } from 'react-icons/fa6'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import Confirm from '@/components/Confirm'
import { useRouter } from 'next/navigation'
import { ButtonCircle, CustomSubmitButton } from '@/components/dForms'
import Message from '@/components/Message'
import Pagination from '@/components/Pagination'
import Spinner from '@/components/Spinner'
import TableView from '@/components/TableView'
import { IPdf } from '@/types'
import { FormatNumber } from '@/components/FormatNumber'
import DateTime from '@/lib/dateTime'

const Page = () => {
  const [page, setPage] = useState(1)
  const [airline, setAirline] = useState('')
  const [departureCity, setDepartureCity] = useState('')
  const [arrivalCity, setArrivalCity] = useState('')
  const [agency, setAgency] = useState('')
  const [createdAt, setCreatedAt] = useState('')

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['reservations'],
    method: 'GET',
    url: `reservations?page=${page}&limit=${50}&${new URLSearchParams({
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
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Reservations List'

  // TableView
  const table = {
    header: [
      { title: 'Passengers', className: 'hidden md:table-cell' },
      { title: 'Departure Date' },
      { title: 'Departure City' },
      { title: 'Arrival City' },
      { title: 'Reservation ID', className: 'hidden md:table-cell' },
      { title: 'PNR Number', className: 'hidden md:table-cell' },
      { title: 'Agency', className: 'hidden md:table-cell' },
      { title: 'Fare' },
      { title: 'Status', className: 'hidden md:table-cell' },
      // { title: 'CreatedAt', className: 'hidden md:table-cell' },
      { title: 'Action' },
    ],
    body: [
      {
        format: (item: IPdf) => item?.passengers?.length,
        className: 'hidden md:table-cell',
      },
      {
        format: (item: IPdf) =>
          DateTime(item?.flight?.departureDate).format('DD-MM-YYYY HH:mm'),
      },
      {
        format: (item: IPdf) => item?.flight?.fromCityName,
      },
      {
        format: (item: IPdf) => item?.flight?.toCityName,
      },
      {
        format: (item: IPdf) => item?.reservationId,
        className: 'hidden md:table-cell',
      },
      {
        format: (item: IPdf) => item?.pnrNumber,
        className: 'hidden md:table-cell',
      },
      {
        format: (item: IPdf) =>
          item?.createdBy?.name || <span className='text-red-500'>NA</span>,
        className: 'hidden md:table-cell',
      },
      {
        format: (item: IPdf) => (
          <FormatNumber
            isCurrency={true}
            value={item?.prices?.reduce((acc, cur) => acc + cur?.totalPrice, 0)}
          />
        ),
      },
      {
        format: (item: any) =>
          item?.status === 'ACTIVE' ? (
            <span className='text-green-500'>{item?.status}</span>
          ) : item?.status === 'BOOKED' ? (
            <span className='text-blue-500'>{item?.status}</span>
          ) : (
            <span className='text-red-500'>{item?.status}</span>
          ),
        className: 'hidden md:table-cell',
      },
      // {
      //   className: 'hidden md:table-cell',
      //   format: (item: any) => moment(item?.createdAt).format('DD-MM-YYYY'),
      // },
      {
        format: (item: any) => (
          <div className='dropdown dropdown-top dropdown-left z-30'>
            <label tabIndex={0} className='cursor-pointer'>
              <FaEllipsis className='text-2xl' />
            </label>
            <ul
              tabIndex={0}
              className='dropdown-content menu p-2 bg-white rounded-tl-box rounded-tr-box rounded-bl-box w-28 border border-gray-200 shadow'
            >
              <li className='h-10 w-24'>
                <ButtonCircle
                  isLoading={deleteApi?.isPending}
                  label='Delete'
                  onClick={() => deleteHandler(item.id)}
                  icon={<FaTrash className='text-white' />}
                  classStyle='btn-error justify-start text-white'
                />
              </li>
            </ul>
          </div>
        ),
      },
    ],
    data: getApi?.data?.data,
    total: getApi?.data?.total,
    paginationData: getApi?.data,
  }

  return (
    <>
      {deleteApi?.isSuccess && (
        <Message variant='success' value={deleteApi?.data?.message} />
      )}
      {deleteApi?.isError && (
        <Message variant='error' value={deleteApi?.error} />
      )}

      <div className='ms-auto text-end'>
        <Pagination data={table?.paginationData} setPage={setPage} />
      </div>

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant='error' value={getApi?.error} />
      ) : (
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <div className='flex items-center flex-col mb-10 border px-2 pb-5'>
            <h1 className='font-light text-2xl'>
              {name}
              <sup> [{table?.total}] </sup>
            </h1>

            <form onSubmit={searchHandler}>
              <hr className='my-2' />
              <div className='flex flex-row flex-wrap justify-center items-center gap-2'>
                <div className='form-control w-full md:w-[48%] lg:w-[32%] mx-auto'>
                  <label className='label'>
                    <span className='label-text'>Airline</span>
                  </label>
                  <input
                    className='input border-gray-300'
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
                    className='input border-gray-300'
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
                    className='input border-gray-300'
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
                    className='input border-gray-300'
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
                    className='input border-gray-300'
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
          <TableView table={table} />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
