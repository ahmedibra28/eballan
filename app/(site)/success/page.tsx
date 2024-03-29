'use client'

import Message from '@/components/Message'
import PdfGenerator from '@/components/pdf'
import reservation from '@/server/reservation'
import { IPdf } from '@/types'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '@uidotdev/usehooks'
import send from '@/server/send'

export default function Page() {
  const [error, setError] = React.useState<string | null>(null)
  const [reservationData, setReservationData] = React.useState<IPdf | null>(
    null
  )

  const [success, setSuccess] = React.useState('')

  const searchParams = useSearchParams()
  const pnrNumber = String(searchParams.get('pnrNumber'))
  const reservationId = Number(searchParams.get('reservationId'))

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

  const { width, height } = useWindowSize()

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
            .then(() =>
              setSuccess(
                `Reservation pdf sent to ${reservationData?.contactEmail}`
              )
            )
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
    <div className='mx-auto max-w-7xl flex justify-center items-center h-[80vh]'>
      {error && <Message variant='error' value={error} />}
      {success && <Message variant='success' value={success} />}

      <div className='w-full md:w-[75%] lg:w-1/2 bg-white p-4 rounded-xl text-center space-y-3'>
        {!reservationData ? (
          <div className='text-red-500 space-y-5 p-4'>
            <p>Your reservation does not exist</p>

            <Link href={'/'} className='btn btn-error w-full'>
              Go Back
            </Link>
          </div>
        ) : (
          <>
            <Confetti width={Number(width) - 20} height={height!} />
            <Image
              src={'/circle.png'}
              width={400}
              height={400}
              alt='success'
              className='w-20 h-20 mx-auto'
            />
            <h4 className='font-bold'>Your reservation has been confirmed!</h4>
            <p className='text-gray-500 mb-10'>
              Your PNR Number: <strong>{reservationData?.pnrNumber}</strong> and
              Reservation ID:
              <strong> {reservationData?.reservationId}</strong>
            </p>

            <div className='py-10'>
              <p className='text-gray-500 pb-3'>
                You can download your reservation details here
              </p>
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
                      className='btn btn-primary bg-my-primary'
                      disabled={isPending}
                    >
                      {isPending ? 'Sending...' : 'Send To Email & Download'}
                    </button>
                  )
                }}
              </PDFDownloadLink>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
