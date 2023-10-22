import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Reservation from '../../../../models/Reservation'
import { currency } from '../../../../utils/currency'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const totalReservations = await Reservation.countDocuments({
        user: req.user._id,
      })
      const refundedTickets = await Reservation.countDocuments({
        status: 'canceled',
        user: req.user._id,
      })
      const activeReservations = await Reservation.countDocuments({
        status: 'completed',
        user: req.user._id,
      })
      const occupancyReservations = await Reservation.countDocuments({
        'status': { $in: ['completed', 'booked'] },
        'flight.departureDate': { $gte: new Date().toISOString() },
        'user': req.user._id,
      })
      const seatedSold = await Reservation.aggregate([
        {
          $match: {
            status: { $in: ['booked', 'completed'] },
            user: req.user._id,
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
            user: req.user._id,
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
            user: req.user._id,
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

      const topDestinations = await Reservation.aggregate([
        {
          $match: {
            'status': { $in: ['booked', 'completed'] },
            'flight.toCityName': { $exists: true, $ne: null },
            'user': req.user._id,
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

      res.status(200).json({
        reservations: totalReservations || 0,
        amendedTickets: 0,
        refundedTickets: refundedTickets || 0,
        activeReservations: activeReservations || 0,
        occupancyReservations: occupancyReservations || 0,
        seatedSold: seatedSold?.[0]?.seatsSold || 0,
        totalSales: currency(totalSales?.[0]?.totalSales || 0),
        totalSalesCommission: currency(
          totalSalesCommission?.[0]?.totalSales || 0,
        ),
        topDestinations,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
)

export default handler
