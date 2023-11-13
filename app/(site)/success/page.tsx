'use client'

import PdfGenerator from '@/components/pdf/page'
import Pdf from '@/components/pdf/page'
import reservation from '@/server/reservation'
import { IPdf } from '@/types'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function Page() {
  const [error, setError] = React.useState<string | null>(null)
  const [reservationData, setReservationData] = React.useState<IPdf | null>(
    null
  )

  const searchParams = useSearchParams()
  const pnrNumber = String(searchParams.get('pnrNumber'))
  const reservationId = Number(searchParams.get('reservationId'))

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
      console.log(error)
      // setError(String(error))
      // setTimeout(() => {
      //   setError(null)
      // }, 5000)
    }
  }

  React.useEffect(() => {
    getReservation()
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      {!reservationData ? (
        <div> no download </div>
      ) : (
        <PDFDownloadLink
          document={<PdfGenerator data={reservationData!} />}
          fileName='example.pdf'
        >
          {({ blob, url, loading, error }) => {
            console.log({ blob, url, loading, error })
            return loading ? 'Loading document...' : 'Download now!'
          }}
        </PDFDownloadLink>
      )}
    </div>
  )
}
