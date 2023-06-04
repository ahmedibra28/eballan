import axios from 'axios'
import nc from 'next-connect'
import { AVAILABLE_AIRLINES, login } from '../../../utils/help'
import moment from 'moment'

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

      console.log(JSON.stringify(bodyData))

      const airline = body.flight.airline?.replace(' ', '')?.toLowerCase()

      if (!AVAILABLE_AIRLINES.includes(airline as string)) {
        return res.status(400).json({ error: 'Invalid airline' })
      }

      if (!req.body) return res.status(400).json({ error: 'Invalid body' })

      const auth = await login(airline)

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
