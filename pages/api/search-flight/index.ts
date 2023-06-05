import axios from 'axios'
import nc from 'next-connect'
import { AVAILABLE_AIRLINES, login } from '../../../utils/help'
import LoginInfo from '../../../models/LoginInfo'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { airline } = req.query
      const { BASE_URL } = process.env

      if (!AVAILABLE_AIRLINES.includes(airline as string)) {
        return res.status(400).json({ error: 'Invalid airline' })
      }

      if (!req.body) return res.status(400).json({ error: 'Invalid body' })

      const {
        fromDate,
        toDate,
        noAdult,
        noChild,
        noInfant,
        // trip,
        originCity,
        destinationCity,
        // seatType,
      } = req.body

      const newBody = {
        departureDate: fromDate?.slice(0, 10),
        arrivalDate: toDate?.slice(0, 10),
        adultNum: noAdult,
        childNum: noChild,
        infantNum: noInfant,
        requiredSeats: noAdult + noChild + noInfant,
        fromCityId: Number(originCity),
        toCityId: Number(destinationCity),
        timeZoneOffset: '+03:00',
      }

      let auth: any

      // create a login session
      const loginObj = await LoginInfo.findOne({
        accessTokenExpiry: { $gt: Date.now() },
      })

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

      const { data } = await axios.post(
        `${BASE_URL}/${airline}/ReservationApi/api/flights/search`,
        newBody,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      )

      const filteredData = (item: any, airline: string) => {
        const prices = [
          {
            flightId: item.flightPricings[0].flightId,
            passenger: item.flightPricings[0].passengerType,
            commission: item.flightPricings[0].commission,
            fare: item.flightPricings[0].fare,
            numberOfSeats: item.flightPricings[0].numberOfSeats,
            numberOfSeatsAvailable:
              item.flightPricings[0].numberOfSeatsAvailable,
            baggageWeight: item.flightPricings[0].baggageWeight,
            handCarryWeight: item.flightPricings[0].handCarryWeight,
            totalPrice: item.flightPricings[0].totalFare * noAdult,
            ...item.flightPricings[0],
          },
          {
            flightId: item.flightPricings[4].flightId,
            passenger: item.flightPricings[4].passengerType,
            commission: item.flightPricings[4].commission,
            fare: item.flightPricings[4].fare,
            numberOfSeats: item.flightPricings[4].numberOfSeats,
            numberOfSeatsAvailable:
              item.flightPricings[4].numberOfSeatsAvailable,
            baggageWeight: item.flightPricings[4].baggageWeight,
            handCarryWeight: item.flightPricings[4].handCarryWeight,
            totalPrice: item.flightPricings[4].totalFare * noChild,
            ...item.flightPricings[4],
          },
          {
            flightId: item.flightPricings[8].flightId,
            passenger: item.flightPricings[8].passengerType,
            commission: item.flightPricings[8].commission,
            fare: item.flightPricings[8].fare,
            numberOfSeats: item.flightPricings[8].numberOfSeats,
            numberOfSeatsAvailable:
              item.flightPricings[8].numberOfSeatsAvailable,
            baggageWeight: item.flightPricings[8].baggageWeight,
            handCarryWeight: item.flightPricings[8].handCarryWeight,
            totalPrice: item.flightPricings[8].totalFare * noInfant,
            ...item.flightPricings[8],
          },
        ]

        delete item.flightPricings

        return { prices, flight: item, airline }
      }

      const newResult = data?.map((item: any) =>
        filteredData(item, 'Maandeeq Air')
      )

      return res.json(newResult)
    } catch (error: any) {
      res.status(500).json({ error: error.response.data || error.message })
    }
  }
)

export default handler
