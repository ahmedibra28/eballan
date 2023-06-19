import nc from 'next-connect'
import Reservation from '../../../models/Reservation'
import { isAuth } from '../../../utils/auth'
import db from '../../../config/db'
import { eReservation } from '../../../utils/eReservation'
import { sendEmail } from '../../../utils/nodemailer'
import generatePDF from '../../../utils/generatePDF'

const handler = nc()
handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()
      const { _id } = req.body

      const reservation = await Reservation.findById(_id)

      if (!reservation)
        return res.status(404).json({ error: 'Reservation not found' })

      const msg = eReservation({
        message: `Your booking has been confirmed. Your PNR is ${reservation?.flight?.pnrNumber} and your reservation ID is ${reservation?.flight?.reservationId}.`,
      })

      const pdf = await generatePDF(msg)
      const result = sendEmail({
        to: reservation.contact.email,
        subject: `Reservation Confirmation - ${reservation?.flight?.reservationId}`,
        text: msg,
        webName: `eBallan - ${reservation.flight?.airline?.toUpperCase()}`,
        pdf,
      })

      if (await result)
        return res.status(200).json({
          message: `Thank you for booking with us. Your booking has been confirmed. Your PNR is ${reservation?.flight?.pnrNumber} and your reservation ID is ${reservation?.flight?.reservationId}.`,
        })

      return res.json(reservation)
    } catch (error: any) {
      res.status(500).json({ error: error.response.data || error.message })
    }
  }
)

export default handler
