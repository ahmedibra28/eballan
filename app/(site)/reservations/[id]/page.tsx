'use client'

import Message from '@/components/Message'
import PdfGenerator from '@/components/pdf'
import { Capitalize } from '@/lib/capitalize'
import DateTime from '@/lib/dateTime'
import reservation from '@/server/reservation'
import send from '@/server/send'
import { IPdf } from '@/types'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'

export default function Page() {
  const searchParams = useSearchParams()
  const reservationId = Number(searchParams.get('reservationId') || 1)
  const pnrNumber = String(searchParams.get('pnrNumber') || '')

  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState('')
  const [reservationData, setReservationData] = React.useState<IPdf | null>(
    null
  )

  const [isPending, startTransition] = React.useTransition()

  const getReservation = async () => {
    try {
      if (!pnrNumber || !reservationId) {
        setError('Invalid pnrNumber or reservationId')
        setTimeout(() => {
          setError(null)
        }, 5000)
      }
      const data = await reservation({ pnrNumber, reservationId })
      setReservationData(data)
    } catch (error) {
      setError(String(error))
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  React.useEffect(() => {
    getReservation()
    // eslint-disable-next-line
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

  const getTitle = (n: string) => {
    if (n === '1') {
      return 'Mr. '
    } else if (n === '2') {
      return 'Mrs. '
    } else if (n === '3') {
      return 'Chd. '
    } else if (n === '4') {
      return 'Inf. '
    } else return ''
  }

  const handleSendAndDownload = (blob: Blob | null) => {
    if (blob) {
      const reader: any = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        const base64data = reader.result.split(',')[1]

        startTransition(async () => {
          send({
            to: reservationData?.contactEmail!,
            subject: `Reservation Confirmation - ${reservationData?.pnrNumber}`,
            text: `Reservation Confirmation - ${reservationData?.pnrNumber} - ${reservationData?.reservationId}`,
            base64: base64data,
          })
            .then(() => {
              setSuccess(
                `Reservation pdf sent to ${reservationData?.contactEmail}`
              )
              setTimeout(() => {
                setSuccess('')
              }, 5000)
            })
            .catch((err) => {
              setError(err?.message)
              setTimeout(() => {
                setError(null)
              }, 5000)
            })
        })
      }
    }
  }

  return (
    <div className='mx-auto max-w-7xl '>
      {error && <Message variant='error' value={error} />}
      {success && <Message variant='success' value={success} />}

      <div className='flex flex-wrap justify-between gap-2'>
        <div className='w-full md:w-[58%] lg:w-[64%] bg-white card-body'>
          <div className='overflow-x-auto'>
            <p className='font-bold'>List of passengers</p>
            <table className='table mt-2 text-sm'>
              <thead>
                <tr className='bg-base-200'>
                  <th>#</th>
                  <th>Type</th>
                  <th>Full Name</th>
                  <th>Date of Birth</th>
                  <th>Nationality</th>
                </tr>
              </thead>
              <tbody>
                {reservationData?.passengers?.map((p, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <th>{p.passengerType}</th>
                    <td>
                      {getTitle(p.passengerTitle)} {p.firstName} {p.secondName}{' '}
                      {p.lastName}
                    </td>
                    <td>{DateTime(p.dob).format('DD MMM YYYY')}</td>
                    <td>{Capitalize(p.country)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='w-full md:w-[48%] lg:w-[34%] bg-white card-body text-sm'>
          <div>
            <p>
              To go on trip from
              <strong> {reservationData?.flight?.fromCityName} </strong>
              to
              <strong> {reservationData?.flight?.toCityName}</strong>
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
                  DateTime(reservationData?.flight?.arrivalDate).format('hh:mm')
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
                    {isPending ? 'Sending...' : 'Send To Email & Download'}
                  </button>
                )
              }}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  )
}
