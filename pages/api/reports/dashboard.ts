import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import db from '../../../config/db'
import UserRole from '../../../models/UserRole'
import Airline from '../../../models/Airline'
import Reservation from '../../../models/Reservation'
import { currency } from '../../../utils/currency'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const totalAgents = await UserRole.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
          },
        },
        {
          $match: {
            'user.confirmed': true,
            'user.blocked': false,
            'role.type': 'AGENT',
          },
        },
        {
          $count: 'count',
        },
      ])

      const totalUsers = await UserRole.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
          },
        },
        {
          $match: {
            'user.confirmed': true,
            'user.blocked': false,
            'role.type': 'AUTHENTICATED',
          },
        },
        {
          $count: 'count',
        },
      ])

      const totalAirlines = await Airline.countDocuments({ status: 'active' })
      const totalReservations = await Reservation.countDocuments({})
      const refundedTickets = await Reservation.countDocuments({
        status: 'canceled',
      })
      const activeReservations = await Reservation.countDocuments({
        status: 'completed',
      })
      const occupancyReservations = await Reservation.countDocuments({
        status: { $in: ['completed', 'booked'] },
        'flight.departureDate': { $gte: new Date().toISOString() },
      })
      const seatedSold = await Reservation.aggregate([
        {
          $match: {
            status: { $in: ['booked', 'completed'] },
          },
        },
        {
          $project: {
            _id: 0,
            seatsSold: {
              $sum: [
                { $size: '$passengers.adult' },
                { $size: '$passengers.child' },
                { $size: '$passengers.infant' },
              ],
            },
          },
        },
        {
          $count: 'seatsSold',
        },
      ])

      const totalSales = await Reservation.aggregate([
        {
          $match: {
            status: { $in: ['booked', 'completed'] },
          },
        },
        {
          $project: {
            _id: 0,
            adultPassengers: { $size: '$passengers.adult' },
            childPassengers: { $size: '$passengers.child' },
            infantPassengers: { $size: '$passengers.infant' },
            adultPrice: {
              $filter: {
                input: '$prices',
                as: 'price',
                cond: { $eq: ['$$price.passengerType', 'Adult'] },
              },
            },
            childPrice: {
              $filter: {
                input: '$prices',
                as: 'price',
                cond: { $eq: ['$$price.passengerType', 'Child'] },
              },
            },
            infantPrice: {
              $filter: {
                input: '$prices',
                as: 'price',
                cond: { $eq: ['$$price.passengerType', 'Infant'] },
              },
            },
          },
        },
        {
          $project: {
            totalAdultSales: {
              $multiply: [
                '$adultPassengers',
                {
                  $add: [
                    { $arrayElemAt: ['$adultPrice.fare', 0] },
                    { $arrayElemAt: ['$adultPrice.commission', 0] },
                  ],
                },
              ],
            },
            totalChildSales: {
              $multiply: [
                '$childPassengers',
                {
                  $add: [
                    { $arrayElemAt: ['$childPrice.fare', 0] },
                    { $arrayElemAt: ['$childPrice.commission', 0] },
                  ],
                },
              ],
            },
            totalInfantSales: {
              $multiply: [
                '$infantPassengers',
                {
                  $add: [
                    { $arrayElemAt: ['$infantPrice.fare', 0] },
                    { $arrayElemAt: ['$infantPrice.commission', 0] },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: {
                $add: [
                  '$totalAdultSales',
                  '$totalChildSales',
                  '$totalInfantSales',
                ],
              },
            },
          },
        },
      ])

      const totalSalesCommission = await Reservation.aggregate([
        {
          $match: {
            status: { $in: ['booked', 'completed'] },
          },
        },
        {
          $project: {
            _id: 0,
            adultPassengers: { $size: '$passengers.adult' },
            childPassengers: { $size: '$passengers.child' },
            infantPassengers: { $size: '$passengers.infant' },
            adultPrice: {
              $filter: {
                input: '$prices',
                as: 'price',
                cond: { $eq: ['$$price.passengerType', 'Adult'] },
              },
            },
            childPrice: {
              $filter: {
                input: '$prices',
                as: 'price',
                cond: { $eq: ['$$price.passengerType', 'Child'] },
              },
            },
            infantPrice: {
              $filter: {
                input: '$prices',
                as: 'price',
                cond: { $eq: ['$$price.passengerType', 'Infant'] },
              },
            },
          },
        },
        {
          $project: {
            totalAdultSales: {
              $multiply: [
                '$adultPassengers',
                {
                  $add: [{ $arrayElemAt: ['$adultPrice.commission', 0] }],
                },
              ],
            },
            totalChildSales: {
              $multiply: [
                '$childPassengers',
                {
                  $add: [{ $arrayElemAt: ['$childPrice.commission', 0] }],
                },
              ],
            },
            totalInfantSales: {
              $multiply: [
                '$infantPassengers',
                {
                  $add: [{ $arrayElemAt: ['$infantPrice.commission', 0] }],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: {
                $add: [
                  '$totalAdultSales',
                  '$totalChildSales',
                  '$totalInfantSales',
                ],
              },
            },
          },
        },
      ])

      const totalRevenueByAirline = await Reservation.aggregate([
        {
          $match: {
            status: { $in: ['booked', 'completed'] },
            prices: { $exists: true, $ne: [] },
            'prices.fare': { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: {
              airline: '$flight.airline',
            },
            totalRevenue: {
              $sum: {
                $multiply: [
                  {
                    $add: [
                      { $arrayElemAt: ['$prices.commission', 0] },
                      { $arrayElemAt: ['$prices.fare', 0] },
                    ],
                  },
                  { $size: '$passengers.adult' },
                ],
              },
            },
          },
        },
      ])

      const topDestinations = await Reservation.aggregate([
        {
          $match: {
            status: { $in: ['booked', 'completed'] },
            'flight.toCityName': { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: '$flight.toCityName',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
      ])

      const revenueGrowthForLastFiveMonths = await Reservation.aggregate([
        {
          $match: {
            status: { $in: ['booked', 'completed'] },
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
              $lte: new Date(),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m',
                date: '$createdAt',
              },
            },
            totalRevenue: {
              $sum: {
                $multiply: [
                  {
                    $add: [
                      { $arrayElemAt: ['$prices.commission', 0] },
                      { $arrayElemAt: ['$prices.fare', 0] },
                    ],
                  },
                  { $size: '$passengers.adult' },
                ],
              },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])

      const refundedTicketForLastFiveMonths = await Reservation.aggregate([
        {
          $match: {
            status: { $nin: ['booked', 'completed'] },
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
              $lte: new Date(),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m',
                date: '$createdAt',
              },
            },
            count: { $sum: 1 },
          },
        },
      ])

      const topUsers = await Reservation.aggregate([
        {
          $match: {
            status: { $in: ['booked', 'completed'] },
            user: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: '$user',
            count: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $multiply: [
                  {
                    $add: [
                      { $arrayElemAt: ['$prices.commission', 0] },
                      { $arrayElemAt: ['$prices.fare', 0] },
                    ],
                  },
                  { $size: '$passengers.adult' },
                ],
              },
            },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
      ])

      const topAgents = await Promise.all(
        topUsers.map(async (user: any) => {
          const userRole = await UserRole.findOne({ user: user._id })
            .populate('role', 'type')
            .populate('user', 'name')

          if (userRole?.role.type !== 'AGENT') return

          return {
            ...user,
            name: userRole?.user.name,
          }
        })
      )

      res.status(200).json({
        agents: totalAgents?.[0]?.count || 0,
        users: totalUsers?.[0]?.count || 0,
        airlines: totalAirlines || 0,
        reservations: totalReservations || 0,
        amendedTickets: 0,
        refundedTickets: refundedTickets || 0,
        activeReservations: activeReservations || 0,
        occupancyReservations: occupancyReservations || 0,
        seatedSold: seatedSold?.[0]?.seatsSold || 0,
        totalSales: currency(totalSales?.[0]?.totalSales || 0),
        totalSalesCommission: currency(
          totalSalesCommission?.[0]?.totalSales || 0
        ),
        totalRevenueByAirline: totalRevenueByAirline?.reduce(
          (acc: any, cur: any) => {
            acc[cur._id.airline] = cur.totalRevenue || 0
            return acc
          },
          {}
        ),
        topDestinations,
        revenueGrowthForLastFiveMonths: revenueGrowthForLastFiveMonths?.map(
          (item: any) => {
            return {
              month: item._id,
              revenue: item.totalRevenue,
            }
          }
        ),
        refundedTicketForLastFiveMonths,
        topAgents: topAgents
          .filter((agent: any) => agent)
          ?.map((item) => ({
            ...item,
            totalRevenue: currency(item.totalRevenue),
          })),
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
