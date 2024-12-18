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
                contactEmail: {
                  contains: email,
                  mode: 'insensitive',
                },
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
        orderBy: {
          createdAt: 'desc',
        },
      }))

    if (!getData || getData.length === 0) {
      return { error: 'Reservation not found' }
    }

    return getData as IPdf[]
  } catch (error: any) {
    return { error: error?.message }
  }
}
