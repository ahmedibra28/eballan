import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { isAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const reservationObj =
      params.id &&
      (await prisma.reservation.update({
        where: { id: params.id },
        data: {
          status: 'INACTIVE',
        },
      }))

    if (!reservationObj)
      return getErrorResponse('Error cancelling reservation', 500)

    return NextResponse.json({
      ...reservationObj,
      message: 'Reservation cancelled successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
