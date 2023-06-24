import React, { useEffect, useState } from 'react'
import Search from '../home/Search'
import Result from './Result'
import useSearchFlightStore from '../../zustand/searchFlightStore'
import apiHook from '../../api'
import Message from '../Message'
import Spinner from '../Spinner'

const SearchResult = () => {
  const [error, setError] = useState('')
  const [fromDate, setFromDate] = useState<any>(new Date())
  const [toDate, setToDate] = useState<any>(new Date())
  const [trip, setTrip] = useState('One-way')
  const [seatType, setSeatType] = useState('Economy')
  const [noAdult, setNoAdult] = useState(0)
  const [noChild, setNoChild] = useState(0)
  const [noInfant, setNoInfant] = useState(0)
  const [originCity, setOriginCity] = useState('')
  const [destinationCity, setDestinationCity] = useState('')

  const { searchFlight, updateSearchFlight } = useSearchFlightStore(
    (state) => state
  )

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
      // @ts-ignore
      updateSearchFlight({ result: searchFlightApi?.data })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFlightApi?.isSuccess])

  useEffect(() => {
    setFromDate(searchFlight?.fromDate || new Date())
    setToDate(searchFlight?.toDate || new Date())
    setTrip(searchFlight?.trip || 'One-way')
    setSeatType(searchFlight?.seatType || 'Economy')
    setNoAdult(searchFlight?.noAdult || 0)
    setNoChild(searchFlight?.noChild || 0)
    setNoInfant(searchFlight?.noInfant || 0)
    setOriginCity(searchFlight?.originCity || '')
    setDestinationCity(searchFlight?.destinationCity || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="headerBox">
      {error && <Message variant="danger" value={error} />}

      {searchFlightApi?.isLoading && <Spinner />}

      {searchFlightApi?.isError && (
        <Message variant="danger" value={searchFlightApi?.error} />
      )}

      <div className="bg-primary mt-2 container-fluid w-100 mx-auto text-center">
        <div className="d-flex flex-column justify-content-center align-items-center h-100">
          <Search
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
      <div className="container mt-3">
        {!searchFlightApi?.isLoading &&
        searchFlight?.result &&
        searchFlight?.result?.length > 0 ? (
          searchFlight?.result?.map((item, i) => <Result key={i} item={item} />)
        ) : (
          <div className="text-center text-danger font-monospace">
            <h4>Sorry no results found. Please change your search</h4>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResult
