'use client'

import SearchForm from '@/components/ui/SearchForm'
import DateTime from '@/lib/dateTime'
import useFlightStore from '@/zustand/useFlightStore'
import useFlightsStore from '@/zustand/useFlightsStore'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const router = useRouter()

  const { flights } = useFlightsStore((state) => state)
  const { updateFlight } = useFlightStore((state) => state)
  const [isPending, setIsPending] = React.useState(true)
  React.useEffect(() => {
    setTimeout(() => {
      setIsPending(false)
    }, 4000)
  }, [])

  function getHoursBetween(startTime: string, endTime: string): string {
    const start = new Date(`2022-01-01T${startTime}Z`)
    const end = new Date(`2022-01-01T${endTime}Z`)
    const diff = end.getTime() - start.getTime()
    const hours = diff / (1000 * 60 * 60)

    if (hours >= 1) {
      const wholeHours = Math.floor(hours)
      const minutes = Math.round((hours - wholeHours) * 60)
      return `${wholeHours}:${minutes < 10 ? '0' : ''}${minutes} hour`
    } else {
      const minutes = Math.round(hours * 60)
      return `${minutes} minutes`
    }
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='md:mx-auto bg-my-secondary'>
        <SearchForm />
      </div>

      {flights?.length > 0 && (
        <div className='divider'>
          We have found {flights?.length || 0} flights
        </div>
      )}

      {flights?.length === 0 && !isPending && (
        <div className='divider text-red-500'>
          Sorry, we could not find any flights
        </div>
      )}

      {flights?.map((flight, index) => (
        <div
          key={index}
          className='p-2 bg-gray-200 w-full rounded-xl flex flex-wrap justify-between items-center mb-5'
        >
          <div className='w-full md:w-[25%] lg:w-[20%] p-2 mx-auto md:border md:border-white md:border-b-0 md:border-l-0 md:border-t-0 flex flex-col items-center justify-center duration-1000'>
            {/*  eslint-disable-next-line */}
            <img
              src={flight?.airline?.logo || '/noimageavailable.png'}
              width={200}
              height={200}
              alt='logo'
              className='h-32 w-auto object-contain rounded-xl'
            />
            <h3 className='uppercase font-bold mt-2'>
              {flight?.airline?.name}
            </h3>
          </div>
          <div className='w-full md:w-[48%] lg:w-[58%] md:p-2 h-full mx-auto flex flex-row items-center justify-around md:gap-x-2 duration-1000'>
            <div className='h-36 w-24 text-xs md:text-sm md:w-36 flex flex-col justify-center items-center gap-y-3'>
              <p>
                {DateTime(flight?.flight?.departureDate)?.format('DD MMM YYYY')}
              </p>
              <p>{DateTime(flight?.flight?.departureDate)?.format('hh:mm')}</p>
              <p>{flight?.flight?.fromCityCode}</p>
            </div>
            <div className='h-36 w-24 text-xs md:text-sm md:w-36 flex flex-col justify-center items-center gap-y-3'>
              <p>
                {getHoursBetween(
                  DateTime(flight?.flight?.departureDate).format('hh:mm'),
                  DateTime(flight?.flight?.arrivalDate).format('hh:mm')
                )}
              </p>
            </div>
            <div className='h-36 w-24 text-xs md:text-sm md:w-36 flex flex-col justify-center items-center gap-y-3'>
              <p>
                {DateTime(flight?.flight?.arrivalDate)?.format('DD MMM YYYY')}
              </p>
              <p>{DateTime(flight?.flight?.arrivalDate)?.format('hh:mm')}</p>
              <p>{flight?.flight?.toCityCode}</p>
            </div>
          </div>
          <div className='w-full md:w-[25%] lg:w-[20%] p-2 h-full mx-auto md:border md:border-white md:border-b-0 md:border-r-0 md:border-t-0 text-center my-auto flex flex-row md:flex-col gap-x-4 md:gap-y-4 items-center justify-center duration-1000'>
            <button className='btn btn-ghost hover:bg-my-secondary border-my-secondary w-auto md:w-44'>
              $
              {flight?.prices
                ?.reduce((acc, cur) => acc + cur?.totalPrice, 0)
                ?.toFixed(2)}
            </button>
            <button
              onClick={() => {
                updateFlight(flight)
                router.push('/passengers')
              }}
              className='btn bg-my-primary text-white w-44'
            >
              Select
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
