'use server'

import { getEnvVariable } from '@/lib/helpers'
import axios from 'axios'
import { prisma } from '@/lib/prisma.db'
import { IFlight } from '@/types'
import { v4 as uuidv4 } from 'uuid'

// 22947
export default async function cancelReservation({
  reservationId,
  phone,
  email,
}: {
  reservationId: number
  phone: string
  email: string
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
      throw new Error('Reservation not found or already cancelled')

    let airline = await prisma.airline.findFirst({
      where: {
        status: 'ACTIVE',
        api: `${reservation.flight?.airline?.api}`,
      },
    })
    if (!airline) throw new Error(`No active airline`)

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
      if (!data) throw new Error(`Failed to login to ${airline?.name}`)

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
      throw new Error(`Failed to cancel reservation`)
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
    throw new Error(`Error cancelling reservation: ${error?.message}`)
  }
}
