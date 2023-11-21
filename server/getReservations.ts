'use server'

import { IPdf } from '@/types'
import { prisma } from '@/lib/prisma.db'

export default async function getMyReservation({
  email,
  phone,
  reservationId,
}: {
  email?: string
  phone?: string
  reservationId?: number
}) {
  try {
    const getData =
      (phone || email || reservationId) &&
      (await prisma.reservation.findMany({
        where: {
          OR: [
            {
              ...(email && {
                contactEmail: email,
              }),
              ...(phone && {
                contactPhone: phone,
              }),
              ...(reservationId && {
                reservationId: reservationId,
              }),
            },
          ],
        },
        include: {
          flight: {
            include: {
              airline: {
                select: {
                  name: true,
                  logo: true,
                  api: true,
                  id: true,
                },
              },
            },
          },
          passengers: true,
          prices: true,
        },
      }))

    if (!getData || getData.length === 0) {
      throw new Error('Reservation not found')
    }

    return getData as IPdf[]
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
