import React, { useEffect, useState } from 'react'

import Search from './Search'
import apiHook from '../../api'
import useSearchFlightStore from '../../zustand/searchFlightStore'
import Message from '../Message'
import Spinner from '../Spinner'
import { useRouter } from 'next/router'

const Header = () => {
  const router = useRouter()

  const [error, setError] = useState('')
  const [fromDate, setFromDate] = useState<Date>(new Date())
  const [toDate, setToDate] = useState<Date>(new Date())
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
    url: `search-flight?airline=maandeeqair`,
  })?.post

  const { updateSearchFlight } = useSearchFlightStore((state) => state)

  const submitHandler = async (data: any) => {
    if (
      !data.fromDate ||
      !data.toDate ||
      !data.trip ||
      !data.originCity ||
      !data.destinationCity ||
      !data.seatType ||
      (data.noAdult === 0 && data.noChild === 0 && data.noInfant === 0)
    ) {
      setError('Please fill all fields')
      setTimeout(() => {
        setError('')
      }, 5000)

      return
    }

    updateSearchFlight({ ...data, result: [] })

    searchFlightApi?.mutateAsync(data).catch((err) => err)
  }

  useEffect(() => {
    if (searchFlightApi?.isSuccess) {
      setError('')
      updateSearchFlight({ result: searchFlightApi?.data })
      router.push('/search-results')
    }
  }, [searchFlightApi?.isSuccess])

  return (
    <div className="bg-primary headerBox pt-1">
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
