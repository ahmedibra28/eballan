import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { Prisma, prisma } from '@/lib/prisma.db'

import { NextResponse } from 'next/server'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const queryStatus = searchParams.get('status')

    const query = q
      ? {
          name: { contains: q, mode: Prisma.QueryMode.insensitive },
        }
      : {}

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.airline.findMany({
        where: {
          ...query,
          ...(queryStatus && { status: 'ACTIVE' }),
        },
        select: {
          name: true,
          api: true,
          username: true,
          password: true,
          status: true,
          createdAt: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.airline.count({
        where: {
          ...query,
          ...(queryStatus && { status: 'ACTIVE' }),
        },
      }),
    ])

    const pages = Math.ceil(total / pageSize)

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

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

    const checkExistence =
      name &&
      (await prisma.airline.findFirst({
        where: {
          name: {
            equals: api?.trim(),
            mode: Prisma.QueryMode.insensitive,
          },
        },
      }))
    if (checkExistence) return getErrorResponse('Duplicate entry', 409)

    const categoryObj = await prisma.airline.create({
      data: {
        name,
        api: api?.trim(),
        adultCommission: Number(adultCommission),
        childCommission: Number(childCommission),
        infantCommission: Number(infantCommission),
        logo,
        username,
        password,
        status,
      },
    })

    if (!categoryObj) return getErrorResponse('Error creating category', 500)

    return NextResponse.json({
      categoryObj,
      message: 'Category created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
