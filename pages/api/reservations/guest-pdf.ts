import nc from 'next-connect'
import Reservation from '../../../models/Reservation'
import db from '../../../config/db'
import { eReservation } from '../../../utils/eReservation'
import { sendEmail } from '../../../utils/nodemailer'
import generatePDF from '../../../utils/generatePDF'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()
      const { q, final, data } = req.body

      if (final && data) {
        console.log(JSON.stringify(data, null, 2))
        const msg = eReservation({
          message: `Your booking has been confirmed. Your PNR is ${data?.flight?.pnrNumber} and your reservation ID is ${data?.flight?.reservationId}.`,
        })

        const pdf = await generatePDF(msg)
        const result = sendEmail({
          to: data.contact.email,
          subject: `Reservation Confirmation - ${data?.flight?.reservationId}`,
          text: msg,
          webName: `eBallan - ${data.flight?.airline?.toUpperCase()}`,
          pdf,
        })

        if (await result)
          return res.status(200).json({
            message: `Thank you for booking with us. Your booking has been confirmed. Your PNR is ${data?.flight?.pnrNumber} and your reservation ID is ${data?.flight?.reservationId}.`,
          })
        return res.status(500).json({ error: 'Something went wrong!' })
      }

      const reservation = await Reservation.find({
        $or: [{ 'contact.email': q }, { 'contact.phone': q }],
      }).sort({ createdAt: -1 })

      if (reservation?.length === 0)
        return res.status(404).json({ error: 'Reservations not found' })

      return res.json(reservation)
    } catch (error: any) {
      res.status(500).json({ error: error.response.data || error.message })
    }
  }
)

export default handler
