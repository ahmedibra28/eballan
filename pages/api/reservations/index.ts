import nc from 'next-connect'
import Reservation from '../../../models/Reservation'
import { isAuth } from '../../../utils/auth'
import db from '../../../config/db'
import moment from 'moment'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { eReservation } from '../../../utils/eReservation'
import { sendEmail } from '../../../utils/nodemailer'
import generatePDF from '../../../utils/generatePDF'
import Airline from '../../../models/Airline'
import { login } from '../../../utils/help'
import { useEVCPayment } from '../../../hook/useEVCPayment'
import { currency } from '../../../utils/currency'
import { Capitalize } from '../../../utils/Capitalize'
import {
  useCreateInvoice,
  useVerifyInvoice,
} from '../../../hook/useEDahabPayment'
import { IFlight } from '../../../types'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()
      const { BASE_URL } = process.env

      const body = req.body
      let { phone } = body.payment
      const { paymentMethod, status, link } = body.payment

      const flight: IFlight = req.body.flight

      if (!phone) {
        return res.status(400).json({ error: 'Invalid phone' })
      }
      if (phone.slice(0, 1) === '0') {
        phone = phone.substring(1)
      }

      if (phone.slice(0, 3) === '252') {
        phone = phone.substring(3)
      }

      if (phone.length !== 9) {
        return res.status(400).json({ error: `Phone number must be 9 digits` })
      }

      const totalPrice =
        flight?.prices?.reduce(
          (acc: any, item: any) => acc + item?.totalPrice,
          0,
        ) || 0

      if (totalPrice < 1)
        return res.status(400).json({ error: 'Invalid amount' })

      // Edahab Implementation
      if (paymentMethod === 'somtel' && status === 'invoice') {
        const createInvoice = await useCreateInvoice(phone, Number(totalPrice))
        if (createInvoice?.StatusCode !== 0)
          return res
            .status(400)
            .json({ error: createInvoice?.StatusDescription })

        const link = `https://edahab.net/api/payment?invoiceId=${createInvoice.InvoiceId}`
        return res.status(200).json({ message: `success`, link })
      }

      if (paymentMethod === 'somtel' && status === 'verify' && link) {
        const invoiceId = link.split('invoiceId=')[1]
        const verifyInvoice = await useVerifyInvoice(invoiceId)

        if (verifyInvoice?.InvoiceStatus !== 'Paid')
          return res.status(401).json({
            error: `Please pay ${verifyInvoice?.InvoiceStatus?.toLowerCase()} invoice first`,
          })

        console.log(verifyInvoice)
      }

      // handle EVC payment
      if (paymentMethod === 'hormuud' || paymentMethod === 'somnet') {
        const { MERCHANT_U_ID, API_USER_ID, API_KEY, MERCHANT_ACCOUNT_NO } =
          process.env

        // if (phone !== '770022200') {
        const paymentInfo = await useEVCPayment({
          merchantUId: MERCHANT_U_ID,
          apiUserId: API_USER_ID,
          apiKey: API_KEY,
          customerMobileNumber: `252${phone}`,
          description: `${phone} has paid ${currency(
            totalPrice,
          )} for flight reservation`,
          amount: totalPrice,
          withdrawTo: 'MERCHANT',
          withdrawNumber: MERCHANT_ACCOUNT_NO,
        })

        if (paymentInfo.responseCode !== '2001')
          return res.status(401).json({ error: `Payment failed` })
      }

      const bodyData = {
        bookingTypeId: 1,
        paymentStatusId: 2,
        reservationStatusId: 1,
        passengers: body.passengers
          .map((item: any) => {
            const adult =
              item?.adult?.map((a: any) => ({
                firstName: a.firstName?.toUpperCase(),
                lastName: a.lastName?.toUpperCase(),
                passportNo: a.passportNumber || '',
                dob: moment(a.dob).format(),
                countryId: 196,
                passengerTypeId: 1,
                passengerTitleId: a.passengerTitle === 'MRS' ? 2 : 1,
                reservationDetails: [
                  {
                    segmentNumber: 1,
                    ticketTypeId: 1,
                    flightRouteId: flight.flight.flightRouteId,
                    flightScheduleId: flight.flight.flightScheduleId,
                  },
                ],
              })) || []

            const child =
              item?.child?.map((a: any) => ({
                firstName: a.firstName?.toUpperCase(),
                lastName: a.lastName?.toUpperCase(),
                passportNo: a.passportNumber || '',
                dob: moment(a.dob).format(),
                countryId: 196,
                passengerTypeId: 2,
                passengerTitleId: 3,
                reservationDetails: [
                  {
                    segmentNumber: 1,
                    ticketTypeId: 1,
                    flightRouteId: flight.flight.flightRouteId,
                    flightScheduleId: flight.flight.flightScheduleId,
                  },
                ],
              })) || []

            const infant =
              item?.infant?.map((a: any) => ({
                firstName: a.firstName?.toUpperCase(),
                lastName: a.lastName?.toUpperCase(),
                passportNo: a.passportNumber || '',
                dob: moment(a.dob).format(),
                nationality: a.nationality, // update the text to id
                countryId: 196,
                passengerTypeId: 3,
                passengerTitleId: 4,
                reservationDetails: [
                  {
                    segmentNumber: 1,
                    ticketTypeId: 1,
                    flightRouteId: flight.flight.flightRouteId,
                    flightScheduleId: flight.flight.flightScheduleId,
                  },
                ],
              })) || []

            return [...adult, ...child, ...infant]
          })
          ?.flat(),
      }

      const airline = flight.airline?.key

      if (!req.body) return res.status(400).json({ error: 'Invalid body' })

      const airlineQuery = await Airline.findOne({ api: airline })
      if (!airlineQuery)
        return res.status(400).json({ error: 'Invalid airline' })

      const auth = await login(
        airlineQuery.api,
        airlineQuery.username,
        airlineQuery.password,
      )

      const { data } = await axios.post(
        `${BASE_URL}/${airline}/ReservationApi/api/bookings/AddConfirmBooking`,
        { ...bodyData, contactInformation: body?.contact },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            uuid: uuidv4(),
            scheme: 'https',
            platform: 1,
          },
        },
      )

      // save to database
      const filteredData = (item: { flight: IFlight }, airline: string) => {
        const prices = [
          {
            commission: item?.flight?.prices[0].commission,
            fare: item?.flight?.prices[0].fare,
            passengerType: item?.flight?.prices[0].passenger,
          },
          {
            commission: item?.flight?.prices[1].commission,
            fare: item?.flight?.prices[1].fare,
            passengerType: item?.flight?.prices[1].passenger,
          },
          {
            commission: item?.flight?.prices[2].commission,
            fare: item?.flight?.prices[2].fare,
            passengerType: item?.flight?.prices[2].passenger,
          },
        ]

        const flight = {
          ...item?.flight?.flight,
          airline,
          reservationId: data?.reservationId,
          pnrNumber: data?.pnrNumber,
        }

        return { prices, flight }
      }

      const createObject = {
        passengers: {
          adult: body?.passengers?.[0]?.adult || [],
          child: body?.passengers?.[0]?.child || [],
          infant: body?.passengers?.[0]?.infant || [],
        },
        ...filteredData(body, airline),
        contact: body?.contact,
        payment: body?.payment,
      }

      const dbData = await Reservation.create({
        ...createObject,
        status: 'booked',
        user: req.user?._id,
      })

      const adult = dbData?.passengers?.adult?.map((item: any) => ({
        passengerTitle: item?.passengerTitle,
        name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
        sex: item?.sex,
        passengerType: 'Adult',
      })) as any
      const child = dbData?.passengers?.child?.map((item: any) => ({
        passengerTitle: item?.passengerTitle,
        name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
        sex: item?.sex,
        passengerType: 'Child',
      })) as any
      const infant = dbData?.passengers?.infant?.map((item: any) => ({
        passengerTitle: item?.passengerTitle,
        name: `${item?.firstName} ${item?.secondName} ${item?.lastName}`,
        sex: item?.sex,
        passengerType: 'Infant',
      })) as any

      const msg = eReservation({
        reservationNo: dbData?.flight?.reservationId,
        passengers: [...adult, ...child, ...infant],
        airline: dbData?.flight?.airline,

        departureCity: dbData?.flight?.fromCityName,
        departureCityCode: dbData?.flight?.fromCityCode,
        departureDate: dbData?.flight?.departureDate,
        departureTime: dbData?.flight?.departureDate,
        departureAirport: dbData?.flight?.fromAirportName,

        arrivalCity: dbData?.flight?.toCityName,
        arrivalCityCode: dbData?.flight?.fromCityCode,
        arrivalDate: dbData?.flight?.arrivalDate,
        arrivalTime: dbData?.flight?.arrivalDate,
        arrivalAirport: dbData?.flight?.toAirportName,

        paymentMobile: dbData?.payment?.phone,
        paymentMethod: Capitalize(dbData?.payment?.paymentMethod),
        createdAt: moment(dbData?.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        ) as any,
      })

      const pdf = await generatePDF(msg)
      const result = sendEmail({
        to: body.contact.email,
        subject: `Reservation Confirmation - ${dbData?.reservationId}`,
        text: msg,
        webName: `eBallan - ${airline?.toUpperCase()}`,
        pdf,
      })

      if (await result)
        return res.status(200).json({
          message: `Thank you for booking with us. Your booking has been confirmed. Your PNR is ${dbData?.pnrNumber} and your reservation ID is ${dbData?.reservationId}.`,
        })

      return res.json(dbData)
    } catch (error: any) {
      res.status(500).json({
        error: error?.response?.data || error?.message,
      })
    }
  },
)

handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { q } = req.query

      const { type } = req.user

      const queryBuilder = q
        ? {
            $or: [
              { 'flight.pnrNumber': { $regex: q, $options: 'i' } },
              { 'flight.reservationId': { $regex: q, $options: 'i' } },
              { 'contact.phone': { $regex: q, $options: 'i' } },
              { 'flight.fromCityName': { $regex: q, $options: 'i' } },
              { 'flight.toCityName': { $regex: q, $options: 'i' } },
            ],
            ...(type !== 'SUPER_ADMIN' && { user: req.user._id }),
          }
        : { ...(type !== 'SUPER_ADMIN' && { user: req.user._id }) }

      let query = Reservation.find(queryBuilder)

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Reservation.countDocuments(queryBuilder)

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

      const result = await query

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
)

// handler.get(
//   async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
//     try {
//       const msg = eReservation({
//         message: `Your booking has been confirmed. Your PNR is ${1222} and your reservation ID is ${4433}.`,
//       })

//       const pdf = await generatePDF(msg)
//       const result = sendEmail({
//         to: 'ahmaat19@gmail.com',
//         subject: `Your booking has been confirmed`,
//         text: msg,
//         webName: `eBallan - Your booking has been confirmed`,
//         pdf,
//       })

//       if (await result)
//         return res.status(200).json({
//           message: `Thank you for contacting me, I'll be in touch very soon.`,
//         })

//       return res.json('success')
//     } catch (error: any) {
//       res.status(500).json({ error: error?.response?.data || error?.message })
//     }
//   }
// )

export default handler
