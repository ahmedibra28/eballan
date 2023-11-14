'use server'

import { IPdf } from '@/types'
import { prisma } from '@/lib/prisma.db'

export default async function reservation({
  pnrNumber,
  reservationId,
}: {
  pnrNumber: string
  reservationId: number
}) {
  try {
    const getData = await prisma.reservation.findFirst({
      where: {
        pnrNumber: pnrNumber,
        reservationId: reservationId,
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
    })

    if (!getData) {
      throw new Error('Reservation not found')
    }

    return getData as IPdf
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
