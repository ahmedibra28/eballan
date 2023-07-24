import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import { currency } from '../../../../utils/currency'
import UserRole from '../../../../models/UserRole'
import Reservation from '../../../../models/Reservation'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
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
      ])

      const topAgents = await Promise.all(
        topUsers.map(async (user: any) => {
          const userRole = await UserRole.findOne({ user: user._id })
            .populate('role', 'type')
            .populate('user', 'name')

          if (userRole?.role.type !== 'SUPER_ADMIN') return

          return {
            ...user,
            name: userRole?.user.name,
          }
        })
      )

      return res.json(
        topAgents
          .filter((agent: any) => agent)
          ?.map((item: any) => ({
            ...item,
            totalRevenue: currency(item.totalRevenue),
          }))
      )
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
