'use server'

import { getEnvVariable } from '@/lib/helpers'
import axios from 'axios'
import { prisma } from '@/lib/prisma.db'
import { v4 as uuidv4 } from 'uuid'
import DateTime from '@/lib/dateTime'

export default async function cancelReservation({
  reservationId,
  phone,
  email,
}: {
  reservationId: number
  phone: string
  email: string
  error?: string
}) {
  try {
    const BASE_URL = getEnvVariable('BASE_URL')

    const reservation =
      reservationId &&
      phone &&
      email &&
      (await prisma.reservation.findFirst({
        where: {
          reservationId,
          contactPhone: phone,
          contactEmail: email,
          status: 'BOOKED',
        },
        include: {
          flight: {
            include: {
              airline: true,
            },
          },
        },
      }))

    if (!reservation)
      return { error: 'Reservation not found or already cancelled' }

    const departureDateTime = DateTime(
      reservation?.flight?.departureDate
    ).format('YYYY-MM-DD HH:mm:ss')

    const hours = DateTime(departureDateTime).diff(DateTime(), 'hours')

    if (hours < 24) {
      return { error: "Departure date is less than 24 hours, can't cancel" }
    }

    let airline = await prisma.airline.findFirst({
      where: {
        status: 'ACTIVE',
        api: `${reservation.flight?.airline?.api}`,
      },
    })
    if (!airline) return { error: 'No active airline' }

    if ((airline?.accessTokenExpiry || 0) <= Date.now()) {
      const { data } = await axios.post(
        `${BASE_URL}/${airline?.api}/Core/api/login`,
        {
          username: airline?.username,
          password: airline?.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!data) return { error: `Failed to login to ${airline?.name}` }

      await prisma.airline.update({
        where: { id: `${airline?.id}` },
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpiry: Date.now() + 60 * (60 * 1000),
        },
      })
    }

    airline = await prisma.airline.findFirst({
      where: {
        status: 'ACTIVE',
        api: reservation.flight?.airline?.api,
        id: airline?.id,
      },
    })

    const { data } = await axios.get(
      `${BASE_URL}/${reservation.flight?.airline?.api}/ReservationApi/api/bookings/VoidReservation/${reservation?.reservationId}`,
      {
        headers: {
          Authorization: `Bearer ${airline?.accessToken}`,
          uuid: uuidv4(),
          scheme: 'https',
          platform: 1,
        },
      }
    )

    if (data?.message !== 'Success') {
      return { error: `Failed to cancel reservation` }
    }

    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        status: 'INACTIVE',
      },
    })

    return { message: 'Reservation cancelled' }
  } catch (error: any) {
    return { error: `Error cancelling reservation: ${error?.message}` }
  }
}
