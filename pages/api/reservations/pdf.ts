import nc from 'next-connect'
import Reservation, { IReservation } from '../../../models/Reservation'
import { isAuth } from '../../../utils/auth'
import db from '../../../config/db'
import { eReservation } from '../../../utils/eReservation'
import { sendEmail } from '../../../utils/nodemailer'
import generatePDF from '../../../utils/generatePDF'
import { Capitalize } from '../../../utils/Capitalize'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()
      const { _id } = req.body

      const reservation = (await Reservation.findById(_id)) as IReservation

      if (!reservation)
        return res.status(404).json({ error: 'Reservation not found' })

      const adult = reservation?.passengers?.adult?.map((item) => ({
        passengerTitle: item?.passengerTitle,
        name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
        sex: item?.sex,
        passengerType: 'Adult',
      })) as any
      const child = reservation?.passengers?.child?.map((item) => ({
        passengerTitle: item?.passengerTitle,
        name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
        sex: item?.sex,
        passengerType: 'Child',
      })) as any
      const infant = reservation?.passengers?.infant?.map((item) => ({
        passengerTitle: item?.passengerTitle,
        name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
        sex: item?.sex,
        passengerType: 'Infant',
      })) as any

      const msg = eReservation({
        reservationNo: reservation?.flight?.reservationId,
        passengers: [...adult, ...child, ...infant],
        airline: reservation?.flight?.airline,

        departureCity: reservation?.flight?.fromCityName,
        departureCityCode: reservation?.flight?.fromCityCode,
        departureDate: reservation?.flight?.departureDate,
        departureTime: reservation?.flight?.departureDate,
        departureAirport: reservation?.flight?.fromAirportName,

        arrivalCity: reservation?.flight?.toCityName,
        arrivalCityCode: reservation?.flight?.fromCityCode,
        arrivalDate: reservation?.flight?.arrivalDate,
        arrivalTime: reservation?.flight?.arrivalDate,
        arrivalAirport: reservation?.flight?.toAirportName,

        paymentMobile: reservation?.payment?.phone,
        paymentMethod: Capitalize(reservation?.payment?.paymentMethod),
        createdAt: moment(reservation?.createdAt).format(
          'YYYY-MM-DD HH:mm:ss'
        ) as any,
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
      res.status(500).json({ error: error?.response?.data || error?.message })
    }
  }
)

export default handler
