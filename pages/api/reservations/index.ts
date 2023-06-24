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

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { startDate, endDate } = req.query

      const s = moment(startDate).startOf('day').format()
      const e = moment(endDate).endOf('day').format()

      const { type } = req.user

      const queryBuilder =
        startDate && endDate
          ? {
              createdAt: {
                $gte: s,
                $lte: e,
              },
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
  }
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
//       res.status(500).json({ error: error.response.data || error.message })
//     }
//   }
// )

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()
      const { BASE_URL } = process.env

      const body = req.body

      // handle EVC payment
      const totalPrice =
        body?.flight?.prices?.reduce(
          (acc: any, item: any) => acc + item?.totalPrice,
          0
        ) || 0

      if (totalPrice < 1)
        return res.status(400).json({ error: 'Invalid amount' })

      const { MERCHANT_U_ID, API_USER_ID, API_KEY, MERCHANT_ACCOUNT_NO } =
        process.env

      const paymentInfo = await useEVCPayment({
        merchantUId: MERCHANT_U_ID,
        apiUserId: API_USER_ID,
        apiKey: API_KEY,
        customerMobileNumber: `252${body.payment.phone}`,
        description: `${body.payment.phone} has paid ${currency(
          totalPrice
        )} for flight reservation`,
        amount: totalPrice,
        withdrawTo: 'MERCHANT',
        withdrawNumber: MERCHANT_ACCOUNT_NO,
      })

      if (paymentInfo.responseCode !== '2001')
        return res.status(401).json({ error: `Payment failed` })

      const bodyData = {
        id: null,
        bookingTypeId: 1,
        paymentStatusId: 2,
        reservationStatusId: 1,
        contactInformation: {
          id: null,
          additionalInformation: null,
          passengerTitleId: null,
          firstName: null,
          lastName: null,
          email: body.contact.email,
          phone: body.contact.phone,
          phone2: null,
        },
        passengers: body.passengers
          .map((item: any) => {
            const adult =
              item?.adult?.map((a: any) => ({
                id: null,
                firstName: a.firstName?.toUpperCase(),
                lastName: a.lastName?.toUpperCase(),
                passportNo: a.passportNumber,
                dob: moment(a.dob).format(),
                // countryId: a.nationality, // update the text to id
                countryId: 196,
                passengerTypeId: body.flight.prices[0].passengerTypeId, // update to adult id
                passengerTitleId: a.passengerTitle === 'MRS' ? 2 : 1, // update the text to id
                reservationDetails: [
                  {
                    segmentNumber: 1,
                    ticketTypeId: 1,
                    flightPricing: body.flight.prices[0],
                    flightRouteId: body.flight.flight.flightRouteId,
                    flightScheduleId: body.flight.flight.flightScheduleId,
                    reservationDetailPricingLogs: {
                      ticketPrice: body.flight.prices[0].fare,
                      fare: body.flight.prices[0].totalFare,
                      taxGroupId: body.flight.prices[0].taxGroupId,
                      surchargeGroupId: body.flight.prices[0].surchargeGroupId,
                      baseAgentCommission:
                        body.flight.prices[0].baseAgentCommission,
                      nonBaseAgentCommission:
                        body.flight.prices[0].nonBaseAgentCommission,
                      commission: body.flight.prices[0].commission,
                    },
                  },
                ],
              })) || []

            const child =
              item?.child?.map((a: any) => ({
                id: null,
                firstName: a.firstName?.toUpperCase(),
                lastName: a.lastName?.toUpperCase(),
                passportNo: a.passportNumber,
                dob: moment(a.dob).format(),
                // countryId: a.nationality, // update the text to id
                countryId: 196,
                passengerTypeId: body.flight.prices[1].passengerTypeId, // update to child id
                passengerTitleId: 3, // update the text to id
                reservationDetails: [
                  {
                    segmentNumber: 1,
                    ticketTypeId: 1,
                    flightPricing: body.flight.prices[0],
                    flightRouteId: body.flight.flight.flightRouteId,
                    flightScheduleId: body.flight.flight.flightScheduleId,
                    reservationDetailPricingLogs: {
                      ticketPrice: body.flight.prices[0].fare,
                      fare: body.flight.prices[0].totalFare,
                      taxGroupId: body.flight.prices[0].taxGroupId,
                      surchargeGroupId: body.flight.prices[0].surchargeGroupId,
                      baseAgentCommission:
                        body.flight.prices[0].baseAgentCommission,
                      nonBaseAgentCommission:
                        body.flight.prices[0].nonBaseAgentCommission,
                      commission: body.flight.prices[0].commission,
                    },
                  },
                ],
              })) || []

            const infant =
              item?.infant?.map((a: any) => ({
                id: null,
                firstName: a.firstName?.toUpperCase(),
                lastName: a.lastName?.toUpperCase(),
                passportNo: a.passportNumber,
                dob: moment(a.dob).format(),
                // countryId: a.nationality, // update the text to id
                countryId: 196,
                passengerTypeId: body.flight.prices[2].passengerTypeId, // update to infant id
                passengerTitleId: 4, // update the text to id
                reservationDetails: [
                  {
                    segmentNumber: 1,
                    ticketTypeId: 1,
                    flightPricing: body.flight.prices[0],
                    flightRouteId: body.flight.flight.flightRouteId,
                    flightScheduleId: body.flight.flight.flightScheduleId,
                    reservationDetailPricingLogs: {
                      ticketPrice: body.flight.prices[0].fare,
                      fare: body.flight.prices[0].totalFare,
                      taxGroupId: body.flight.prices[0].taxGroupId,
                      surchargeGroupId: body.flight.prices[0].surchargeGroupId,
                      baseAgentCommission:
                        body.flight.prices[0].baseAgentCommission,
                      nonBaseAgentCommission:
                        body.flight.prices[0].nonBaseAgentCommission,
                      commission: body.flight.prices[0].commission,
                    },
                  },
                ],
              })) || []

            return [...adult, ...child, ...infant]
          })
          ?.flat(),
      }

      const airline = body.flight.airline?.replace(' ', '')?.toLowerCase()

      if (!req.body) return res.status(400).json({ error: 'Invalid body' })

      const airlineQuery = await Airline.findOne({ api: airline })
      if (!airlineQuery)
        return res.status(400).json({ error: 'Invalid airline' })

      const auth = await login(
        airlineQuery.api,
        airlineQuery.username,
        airlineQuery.password
      )

      const { data } = await axios.post(
        `${BASE_URL}/${airline}/ReservationApi/api/bookings/AddConfirmBooking`,
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            uuid: uuidv4(),
            scheme: 'https',
            platform: 1,
          },
        }
      )

      // save to database
      const filteredData = (item: any, airline: string) => {
        const prices = [
          {
            commission: item?.flight?.prices[0].commission,
            fare: item?.flight?.prices[0].fare,
            passengerType: item?.flight?.prices[0].passengerType?.type,
          },
          {
            commission: item?.flight?.prices[1].commission,
            fare: item?.flight?.prices[1].fare,
            passengerType: item?.flight?.prices[1].passengerType?.type,
          },
          {
            commission: item?.flight?.prices[2].commission,
            fare: item?.flight?.prices[2].fare,
            passengerType: item?.flight?.prices[2].passengerType?.type,
          },
        ]

        const flight = {
          departureDate:
            item?.flight?.flight?.departureDate?.slice(0, 10) +
            ' ' +
            item?.flight?.flight?.departureTime,
          fromCityName: item?.flight?.flight?.fromCityName,
          fromCityCode: item?.flight?.flight?.fromCityCode,
          fromAirportName: item?.flight?.flight?.fromAirportName,
          fromCountryName: item?.flight?.flight?.fromCountryName,
          arrivalDate:
            item?.flight?.flight?.arrivalDate?.slice(0, 10) +
            ' ' +
            item?.flight?.flight?.arrivalTime,
          toCityName: item?.flight?.flight?.toCityName,
          toCityCode: item?.flight?.flight?.toCityCode,
          toAirportName: item?.flight?.flight?.toAirportName,
          toCountryName: item?.flight?.flight?.toCountryName,
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

      await Reservation.create({
        ...createObject,
        status: 'booked',
        user: req.user?._id,
      })

      const msg = eReservation({
        message: `Your booking has been confirmed. Your PNR is ${data?.pnrNumber} and your reservation ID is ${data?.reservationId}.`,
      })

      const pdf = await generatePDF(msg)
      const result = sendEmail({
        to: body.contact.email,
        subject: `Reservation Confirmation - ${data?.reservationId}`,
        text: msg,
        webName: `eBallan - ${airline?.toUpperCase()}`,
        pdf,
      })

      if (await result)
        return res.status(200).json({
          message: `Thank you for booking with us. Your booking has been confirmed. Your PNR is ${data?.pnrNumber} and your reservation ID is ${data?.reservationId}.`,
        })

      return res.json(data)
    } catch (error: any) {
      res.status(500).json({ error: error.response.data || error.message })
    }
  }
)

export default handler
