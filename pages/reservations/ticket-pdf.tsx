import React from 'react'
import { Message } from '../../components'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import apiHook from '../../api'
import { DynamicFormProps, inputText } from '../../utils/dForms'
import moment from 'moment'

const TicketPDF = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const postApi = apiHook({
    key: ['reservation-guest-pdf'],
    method: 'POST',
    url: `reservations/guest-pdf`,
  })?.post

  const data = postApi?.data

  const submitHandler = (data: { q?: string }) => {
    postApi?.mutateAsync(data)
  }

  const stepOne = () => (
    <div>
      {inputText({
        register,
        errors,
        label: 'Mobile Number / Email',
        name: 'q',
        placeholder: 'Enter Mobile Number / Email',
      } as DynamicFormProps)}

      <button
        type="submit"
        className="btn btn-primary form-control mt-3"
        disabled={postApi?.isLoading}
      >
        {postApi?.isLoading ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          'Next'
        )}
      </button>
    </div>
  )

  const stepTwo = (data: any) => (
    <div className="mb-4">
      <div className="p-2 bg-white">
        <div>
          <span className="fw-bold">Airline</span>
          <span className="ms-2">{data?.flight?.airline?.toUpperCase()}</span>
        </div>

        <div>
          <span className="fw-bold">Reservation ID</span>
          <span className="ms-2">{data?.flight?.reservationId}</span>
        </div>

        <div>
          <span className="fw-bold">PNR Number</span>
          <span className="ms-2">{data?.flight?.pnrNumber}</span>
        </div>
      </div>

      <ul className="list-group rounded-0 border-0">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">Departure Date</div>
            {moment(data?.flight?.departureDate).format('llll')}
          </div>

          <div className="ms-2 ms-auto justify-content-end text-end">
            <div className="fw-bold">Arrival Date</div>
            {moment(data?.flight?.arrivalDate).format('llll')}
          </div>
        </li>

        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">From City</div>
            {data?.flight?.fromCityName}
          </div>

          <div className="ms-2 ms-auto text-end">
            <div className="fw-bold">To City</div>
            {data?.flight?.toCityName}
          </div>
        </li>

        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">From Country</div>
            {data?.flight?.fromCountryName}
          </div>

          <div className="ms-2 ms-auto text-end">
            <div className="fw-bold">To Country</div>
            {data?.flight?.toCountryName}
          </div>
        </li>

        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">From City Code</div>
            {data?.flight?.fromCityCode}
          </div>
          <div className="ms-2 ms-auto text-end">
            <div className="fw-bold">To City Code</div>
            {data?.flight?.toCityCode}
          </div>
        </li>

        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">From Airport</div>
            {data?.flight?.fromAirportName}
          </div>

          <div className="ms-2 ms-auto text-end">
            <div className="fw-bold">To Airport</div>
            {data?.flight?.toAirportName}
          </div>
        </li>
      </ul>
      <button
        type="button"
        className="btn btn-primary form-control mt-0"
        disabled={postApi?.isLoading}
        onClick={() =>
          postApi?.mutateAsync({
            final: Boolean(postApi?.data?.length > 0),
            data: data,
          })
        }
      >
        {postApi?.isLoading ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          'Get eTicket Now'
        )}
      </button>
    </div>
  )

  return (
    <div className="row">
      <div className="col-lg-8 col-md-10 col-12 mx-auto">
        <Head>
          <title>Get Your Reservation Ticket</title>
          <meta
            property="og:title"
            content="Get Your Reservation Ticket"
            key="title"
          />
        </Head>
        <h3 className="fw-light font-monospace text-center mb-5">
          Get Your Reservation Ticket
        </h3>
        {postApi?.isSuccess && (
          <Message
            variant="success"
            value={postApi?.data?.message || 'Found the tickets'}
          />
        )}
        {postApi?.isError && (
          <Message variant="danger" value={postApi?.error} />
        )}

        <form onSubmit={handleSubmit(submitHandler)}>
          {postApi?.data?.length > 0 ? (
            <div className="">
              {data?.map((item: any, i: number) => (
                <div key={i}>{stepTwo(item)}</div>
              ))}
            </div>
          ) : (
            stepOne()
          )}
        </form>
      </div>
    </div>
  )
}

export default TicketPDF
