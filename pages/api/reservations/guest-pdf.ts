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
        const adult = data?.passengers?.adult?.map((item: any) => ({
          passengerTitle: item?.passengerTitle,
          name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
          sex: item?.sex,
          passengerType: 'Adult',
        })) as any
        const child = data?.passengers?.child?.map((item: any) => ({
          passengerTitle: item?.passengerTitle,
          name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
          sex: item?.sex,
          passengerType: 'Child',
        })) as any
        const infant = data?.passengers?.infant?.map((item: any) => ({
          passengerTitle: item?.passengerTitle,
          name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
          sex: item?.sex,
          passengerType: 'Infant',
        })) as any

        const msg = eReservation({
          reservationNo: data?.flight?.reservationId,
          passengers: [...adult, ...child, ...infant],
          airline: data?.flight?.airline,

          departureCity: data?.flight?.fromCityName,
          departureCityCode: data?.flight?.fromCityCode,
          departureDate: data?.flight?.departureDate,
          departureTime: data?.flight?.departureDate,
          departureAirport: data?.flight?.fromAirportName,

          arrivalCity: data?.flight?.toCityName,
          arrivalCityCode: data?.flight?.fromCityCode,
          arrivalDate: data?.flight?.arrivalDate,
          arrivalTime: data?.flight?.arrivalDate,
          arrivalAirport: data?.flight?.toAirportName,

          paymentMobile: data?.payment?.phone,
          paymentMethod: data?.payment?.paymentMethod,
          createdAt: data?.createdAt as any,
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
        $or: [
          { 'flight.pnrNumber': q },
          { 'flight.reservationId': q },
          { 'contact.phone': q },
          { 'contact.email': q },
        ],
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
