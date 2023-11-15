import { isAuth } from '@/lib/auth'
import DateTime from '@/lib/dateTime'
import { getErrorResponse } from '@/lib/helpers'
import { Prisma, prisma } from '@/lib/prisma.db'

import { NextResponse } from 'next/server'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)

    const airline = searchParams.get('airline')
    const departureCity = searchParams.get('departureCity')
    const arrivalCity = searchParams.get('arrivalCity')
    const agency = searchParams.get('agency')
    const createdAt = searchParams.get('createdAt')
    const queryStatus = searchParams.get('status')

    const query =
      departureCity || airline || arrivalCity || agency || createdAt
        ? {
            OR: [
              {
                flight: {
                  ...(departureCity && {
                    fromCityName: {
                      contains: departureCity,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  }),
                  ...(airline && {
                    airline: {
                      name: {
                        contains: airline,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  }),
                  ...(arrivalCity && {
                    toCityName: {
                      contains: arrivalCity,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  }),
                },
                ...(agency && {
                  createdBy: {
                    name: {
                      contains: agency,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                }),
                ...(createdAt && {
                  createdAt: {
                    gte: DateTime(`${createdAt} 10:10:10`)
                      .utc()
                      .startOf('day')
                      .toDate(),
                    lte: DateTime(`${createdAt} 10:10:10`)
                      .utc()
                      .endOf('day')
                      .toDate(),
                  },
                }),
              },
            ],
            ...(req.user.role !== 'SUPER_ADMIN' && {
              createdBy: { id: req.user.id },
            }),
          }
        : {
            ...(req.user.role !== 'SUPER_ADMIN' && {
              createdBy: { id: req.user.id },
            }),
          }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.reservation.findMany({
        where: {
          ...query,
          ...(queryStatus && { status: 'ACTIVE' }),
        },
        include: {
          flight: {
            include: {
              airline: {
                select: {
                  name: true,
                  logo: true,
                },
              },
            },
          },
          passengers: true,
          prices: true,
          createdBy: {
            select: {
              name: true,
              image: true,
              role: {
                select: {
                  type: true,
                },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reservation.count({
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
