import axios from 'axios'
import nc from 'next-connect'
import { AVAILABLE_AIRLINES, login } from '../../../utils/help'
import moment from 'moment'
import Reservation from '../../../models/Reservation'
import LoginInfo from '../../../models/LoginInfo'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { BASE_URL } = process.env

      const body = req.body

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

      if (!AVAILABLE_AIRLINES.includes(airline as string)) {
        return res.status(400).json({ error: 'Invalid airline' })
      }

      if (!req.body) return res.status(400).json({ error: 'Invalid body' })

      let auth: any

      // create a login session
      const loginObj = await LoginInfo.findOne({
        accessTokenExpiry: { $gt: Date.now() },
      })

      if (!loginObj) {
        const newLogin = await login(airline)
        console.log('outside')
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

      const { data } = await axios.post(
        `${BASE_URL}/${airline}/ReservationApi/api/bookings/AddConfirmBooking`,
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            uuid: '9633873a-232c-40dc-af1b-c8f0e06c3e88',
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
        ...filteredData(body, 'Maandeeq Air'),
        contact: body?.contact,
        payment: body?.payment,
      }

      await Reservation.create(createObject)

      return res.json(data)
    } catch (error: any) {
      res.status(500).json({ error: error.response.data || error.message })
    }
  }
)

export default handler

// Cancellation Done by GET

// https://siliconsom.com/SRS/maandeeqair/ReservationApi/api/bookings/VoidReservation/80343

// {"pnrNumber":"AKUX10","reservationId":80343,"message":"Credit Limit Exceeded : 80.00000 - Total Amount : 140","data":null}
