import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { isAuth } from '@/lib/auth'
import { Prisma, prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const {
      name,
      api,
      adultCommission,
      childCommission,
      infantCommission,
      logo,
      username,
      password,
      status,
    } = await req.json()

    const object =
      params.id &&
      (await prisma.airline.findFirst({
        where: { id: params.id },
        select: {
          id: true,
        },
      }))
    if (!object) return getErrorResponse('Airline not found', 404)

    const checkExistence =
      api &&
      (await prisma.airline.findFirst({
        where: {
          api: {
            equals: api?.trim(),
            mode: Prisma.QueryMode.insensitive,
          },
          id: { not: params.id },
        },
        select: {
          id: true,
          api: true,
        },
      }))
    if (checkExistence) return getErrorResponse('Duplicate entry', 409)

    const airlineObj = await prisma.airline.update({
      where: { id: params.id },
      data: {
        name,
        api: api?.trim(),
        adultCommission: parseFloat(adultCommission),
        childCommission: parseFloat(childCommission),
        infantCommission: parseFloat(infantCommission),
        logo,
        username,
        password,
        status,
      },
    })

    if (!airlineObj) return getErrorResponse('Error updating airline', 500)

    airlineObj.accessTokenExpiry = 1 as any

    return NextResponse.json({
      airlineObj,
      message: 'Airline updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const airlineObj =
      params.id &&
      (await prisma.airline.delete({
        where: { id: params.id },
      }))

    if (!airlineObj) return getErrorResponse('Error removing airline', 500)

    return NextResponse.json({
      ...airlineObj,
      message: 'Airline removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
