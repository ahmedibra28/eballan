import { getEnvVariable, getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { isAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma.db'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

interface Params {
  params: {
    id: string
  }
}

export async function DELETE(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const BASE_URL = getEnvVariable('BASE_URL')

    const reservation =
      params.id &&
      (await prisma.reservation.findFirst({
        where: {
          id: params.id,
          ...(req.user.role !== 'SUPER_ADMIN' && {
            createdBy: { id: req.user.id },
          }),
        },
        include: {
          flight: {
            include: {
              airline: true,
            },
          },
        },
      }))

    if (!reservation) return getErrorResponse('Reservation not found', 404)

    if (reservation.status === 'BOOKED') {
      await prisma.reservation.update({
        where: {
          id: params.id,
          ...(req.user.role !== 'SUPER_ADMIN' && {
            createdBy: { id: req.user.id },
          }),
        },
        data: {
          status: 'INACTIVE',
        },
      })

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

      await axios.get(
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
    }

    return NextResponse.json({
      message: 'Reservation cancelled successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
