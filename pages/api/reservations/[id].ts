import nc from 'next-connect'
import Reservation from '../../../models/Reservation'
import db from '../../../config/db'
import { isAuth } from '../../../utils/auth'
import LoginInfo from '../../../models/LoginInfo'
import { login } from '../../../utils/help'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const handler = nc()

handler.use(isAuth)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const object = await Reservation.findOne({ status: 'booked', _id: id })
      if (!object)
        return res.status(400).json({ error: `Reservation not found` })

      let auth
      // create a login session
      const loginObj = await LoginInfo.findOne({
        accessTokenExpiry: { $gt: Date.now() },
      })

      const airline = object.flight.airline?.replace(' ', '')?.toLowerCase()

      if (!loginObj) {
        const newLogin = await login(airline)
        auth = newLogin
        await LoginInfo.create({
          accessToken: newLogin.accessToken,
          refreshToken: newLogin.refreshToken,
          accessTokenExpiry: Date.now() + 60 * (60 * 1000),
        })
      }
      if (loginObj) {
        auth = loginObj
      }

      const { BASE_URL } = process.env

      await axios.get(
        `${BASE_URL}/${airline}/ReservationApi/api/bookings/VoidReservation/${object.flight.reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            uuid: uuidv4(),
            scheme: 'https',
            platform: 1,
          },
        }
      )

      await Reservation.findByIdAndUpdate(object._id, {
        status: 'canceled',
      })

      res.status(200).json({ message: `Reservation removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
