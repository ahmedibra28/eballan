import React, { useEffect, useState } from 'react'

import Search from './Search'
import apiHook from '../../api'
import useSearchFlightStore from '../../zustand/searchFlightStore'
import Message from '../Message'
import Spinner from '../Spinner'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Header = () => {
  const router = useRouter()

  const [error, setError] = useState('')
  const [fromDate, setFromDate] = useState<any>('')
  const [toDate, setToDate] = useState<any>('')
  const [trip, setTrip] = useState('One-way')
  const [seatType, setSeatType] = useState('Economy')
  const [noAdult, setNoAdult] = useState(0)
  const [noChild, setNoChild] = useState(0)
  const [noInfant, setNoInfant] = useState(0)
  const [originCity, setOriginCity] = useState('')
  const [destinationCity, setDestinationCity] = useState('')

  const getCitiesApi = apiHook({
    key: ['cities'],
    method: 'GET',
    url: `cities?airline=maandeeqair`,
  })?.get

  const searchFlightApi = apiHook({
    key: ['search-flight'],
    method: 'POST',
    url: `search-flight`,
  })?.post

  const { updateSearchFlight } = useSearchFlightStore((state) => state)

  const submitHandler = async (data: any) => {
    if (
      !data.fromDate ||
      // !data.toDate ||
      !data.trip ||
      !data.originCity ||
      !data.destinationCity ||
      !data.seatType ||
      (data.noAdult === 0 && data.noChild === 0 && data.noInfant === 0)
    ) {
      let errorMessage = 'Please fill the following fields:'

      if (!data.fromDate) {
        errorMessage += ' From Date'
      }

      if (!data.toDate) {
        errorMessage += ' To Date'
      }

      if (!data.trip) {
        errorMessage += ' Trip'
      }

      if (!data.originCity) {
        errorMessage += ' Origin City'
      }

      if (!data.destinationCity) {
        errorMessage += ' Destination City'
      }

      if (!data.seatType) {
        errorMessage += ' Seat Type'
      }

      if (data.noAdult === 0 && data.noChild === 0 && data.noInfant === 0) {
        errorMessage += ' Number of Passengers'
      }

      setError(errorMessage)

      setTimeout(() => {
        setError('')
      }, 5000)

      return
    }

    updateSearchFlight({ ...data, result: [] })

    searchFlightApi?.mutateAsync(data).catch((err) => err)
  }

  useEffect(() => {
    if (originCity && destinationCity && originCity === destinationCity) {
      setError('Please select different cities')
      setDestinationCity('')
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }, [originCity, destinationCity])

  useEffect(() => {
    if (searchFlightApi?.isSuccess) {
      setError('')
      // @ts-ignore
      updateSearchFlight({ result: searchFlightApi?.data })
      router.push('/search-results')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFlightApi?.isSuccess])

  return (
    <div className="bg-primary headerBox pt-1">
      <div className="w-100">
        <Image
          src="/ad.png"
          alt="Flight discount advertisement"
          className="w-100 img-fluid"
          width={995}
          height={360}
        />
      </div>

      {error && <Message variant="danger" value={error} />}

      {searchFlightApi?.isLoading && <Spinner />}

      {searchFlightApi?.isError && (
        <Message variant="danger" value={searchFlightApi?.error} />
      )}

      <div className="headerBG">
        <div className="d-flex flex-column justify-content-center align-items-start h-100">
          <Search
            showTitle={true}
            cities={getCitiesApi?.data}
            onSubmit={submitHandler}
            fromDate={fromDate}
            toDate={toDate}
            trip={trip}
            seatType={seatType}
            noAdult={noAdult}
            noChild={noChild}
            noInfant={noInfant}
            originCity={originCity}
            destinationCity={destinationCity}
            setFromDate={setFromDate}
            setToDate={setToDate}
            setTrip={setTrip}
            setSeatType={setSeatType}
            setNoAdult={setNoAdult}
            setNoChild={setNoChild}
            setNoInfant={setNoInfant}
            setOriginCity={setOriginCity}
            setDestinationCity={setDestinationCity}
          />
        </div>
      </div>
    </div>
  )
}

export default Header
