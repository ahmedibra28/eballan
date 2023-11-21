'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { InputEmail, InputTel, InputText } from '@/components/dForms'
import Message from '@/components/Message'
import getMyReservation from '@/server/getReservations'
import { IPdf } from '@/types'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PdfGenerator from '@/components/pdf/page'
import DateTime from '@/lib/dateTime'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import send from '@/server/send'

const Ticket = () => {
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const [data, setData] = React.useState<IPdf[]>([])

  const [step, setStep] = React.useState(1)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const submitHandler = (data: {
    reservationId?: string
    email?: string
    phone?: string
  }) => {
    if (data.reservationId || data.email || data.phone) {
      startTransition(async () => {
        getMyReservation({
          reservationId: Number(data.reservationId),
          phone: data.phone,
          email: data.email,
        })
          .then((data) => {
            setSuccess('Reservation Found. Redirecting...')
            reset()
            setStep(2)
            setData(data)

            setTimeout(() => {
              setSuccess(null)
            }, 5000)
          })
          .catch((error) => {
            setError(String(error))
            setTimeout(() => {
              setError(null)
            }, 5000)
          })
      })
    }
  }

  const stepOne = () => {
    return (
      <div className='w-full md:w-1/2 lg:w-[40%] mx-auto bg-white card-body'>
        <h6 className='fw-bold text-uppercase text-center'>Step 1 / 2</h6>
        <hr />

        <InputText
          register={register}
          isRequired={false}
          errors={errors}
          label='Reservation Number'
          name='reservationId'
          placeholder='Enter Reservation Number'
        />

        <InputEmail
          register={register}
          isRequired={false}
          errors={errors}
          label='Email'
          name='email'
          placeholder='Enter email'
        />

        <InputTel
          register={register}
          isRequired={false}
          errors={errors}
          label='Phone'
          name='phone'
          placeholder='Enter phone'
        />

        <button
          type='submit'
          className='btn btn-primary form-control mt-3 w-44 mx-auto'
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className='spinner-border spinner-border-sm' /> Loading...{' '}
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    )
  }

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

  const handleSendAndDownload = (blob: Blob | null) => {
    if (blob) {
      const reader: any = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        const base64data = reader.result.split(',')[1]

        startTransition(async () => {
          send({
            to: data[0]?.contactEmail!,
            subject: `Reservation Confirmation - ${data[0]?.pnrNumber}`,
            text: `Reservation Confirmation - ${data[0]?.pnrNumber} - ${data[0]?.reservationId}`,
            base64: base64data,
          })
            .then(() => {
              setSuccess(`Reservation pdf sent to ${data[0]?.contactEmail}`)

              setTimeout(() => {
                setSuccess(null)
              }, 5000)
            })
            .catch((err) => {
              setError(err?.message)
              setTimeout(() => {
                setError(null)
              }, 5000)
            })
        })
        return base64data
      }
    }
  }

  const stepTwo = () => {
    return (
      <div className='max-w-7xl mx-auto card-body bg-white'>
        <h6 className='fw-bold text-uppercase text-center'>Step 2 / 2</h6>

        <div className='divider'>
          We have found {data?.length || 0} reservations
        </div>
        <hr />

        <div className='flex flex-row flex-wrap'>
          {data?.map((reservationData, i) => (
            <div
              key={i}
              className='w-full md:w-[48%] bg-white card-body text-sm border border-my-primary m-1'
            >
              <div>
                <p>
                  To go on trip from
                  <strong> {reservationData?.flight?.fromCityName} </strong>
                  to
                  <strong> {reservationData?.flight?.toCityName}</strong> (
                  {reservationData?.passengers?.length} Passengers)
                </p>
                <hr className='my-4' />

                <div className='w-full bg-gray-100 p-2 mb-2'>
                  <strong className='text-my-primary'>From</strong>
                  <p>
                    {reservationData?.flight?.fromCityName} (
                    {reservationData?.flight?.fromCityCode})
                  </p>
                  <p>{reservationData?.flight?.fromAirportName}</p>
                  <p>
                    {DateTime(reservationData?.flight?.departureDate).format(
                      'DD MMM YYYY hh:mm'
                    )}
                  </p>
                </div>
                <div className='w-full bg-gray-100 p-2 mb-2'>
                  <strong className='text-my-primary'>Duration</strong>
                  <p>
                    {getHoursBetween(
                      DateTime(reservationData?.flight?.departureDate).format(
                        'hh:mm'
                      ),
                      DateTime(reservationData?.flight?.arrivalDate).format(
                        'hh:mm'
                      )
                    )}
                  </p>
                </div>
                <div className='w-full bg-gray-100 p-2 mb-2'>
                  <strong className='text-my-primary'>To</strong>
                  <p>
                    {reservationData?.flight?.toCityName} (
                    {reservationData?.flight?.toCityCode})
                  </p>
                  <p>{reservationData?.flight?.toAirportName}</p>
                  <p>
                    {DateTime(reservationData?.flight?.arrivalDate).format(
                      'DD MMM YYYY hh:mm'
                    )}
                  </p>
                </div>
              </div>

              <hr className='mb-2' />

              <div className='w-full bg-gray-100 p-2'>
                <p className='text-sm flex flex-col'>
                  <span className='flex flex-row items-center gap-x-2'>
                    Status:
                    {reservationData?.status === 'BOOKED' ? (
                      <FaCircleCheck className='text-success' />
                    ) : (
                      <FaCircleXmark className='text-error' />
                    )}
                  </span>
                  <span>
                    Created At:
                    <span className='text-my-primary ml-1'>
                      {DateTime(reservationData?.createdAt).format(
                        'DD MMM YYYY HH:mm'
                      )}
                    </span>
                  </span>
                  <span>Contact Mobile: {reservationData?.contactPhone}</span>
                  <span>Contact Email: {reservationData?.contactEmail}</span>
                  <span>Payment Mobile: {reservationData?.paymentPhone}</span>
                  <span>Payment Method: {reservationData?.paymentMethod}</span>
                  <span>Reservation ID: {reservationData?.reservationId}</span>
                  <span>PNR Number: {reservationData?.pnrNumber}</span>
                </p>
              </div>

              <div className='w-full bg-gray-100 p-2 mb-2'>
                <strong className='text-my-primary'>Amount</strong>
                <p>
                  {Number(reservationData?.adult || 0) +
                    Number(reservationData?.child || 0) +
                    Number(reservationData?.infant || 0)}
                  x Passenger
                </p>
                <p>
                  <span className='font-bold uppercase'>Total </span>
                  <span>
                    $
                    {reservationData?.prices
                      ?.reduce((acc, cur) => acc + cur?.totalPrice, 0)
                      ?.toFixed(2)}
                  </span>
                </p>
              </div>
              <div className='w-full'>
                <PDFDownloadLink
                  document={<PdfGenerator data={reservationData!} />}
                  fileName='eballan.pdf'
                >
                  {({ blob, loading, error }) => {
                    return loading ? (
                      'Loading document...'
                    ) : (
                      <button
                        onClick={() => handleSendAndDownload(blob)}
                        className='btn btn-outline btn-primary'
                        disabled={isPending}
                      >
                        {isPending ? 'Sending...' : 'Send To Email'}
                      </button>
                    )
                  }}
                </PDFDownloadLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {error && <Message variant='error' value={error} />}
      {success && <Message variant='success' value={success} />}

      <h3 className='font-bold text-center mb-5'>
        Get Your Reservation Tickets
      </h3>

      <hr />

      <form onSubmit={handleSubmit(submitHandler)}>
        {step === 1 && stepOne()}
        {step === 2 && stepTwo()}
      </form>
    </>
  )
}

export default Ticket
