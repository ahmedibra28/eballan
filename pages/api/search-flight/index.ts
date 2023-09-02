import axios from 'axios'
import nc from 'next-connect'
import { login } from '../../../utils/help'
import db from '../../../config/db'
import Airline from '../../../models/Airline'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()
      // const { airline } = req.query
      const { BASE_URL } = process.env
      if (!req.body) return res.status(400).json({ error: 'Invalid body' })

      // get the airlines from the database
      const airlines = await Airline.find({ status: 'active' }).lean()
      if (!airlines) return res.status(400).json({ error: 'No airlines found' })

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

      const oneWayBody = {
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

      const loginData = await Promise.all(
        airlines.map(async (item: any) => {
          const data = await login(item.api, item.username, item.password)
          return {
            ...item,
            accessToken: data?.accessToken,
          }
        })
      )

      const flights = await Promise.all(
        loginData?.map(async (item: any) => {
          const { data } = await axios.post(
            `${BASE_URL}/${item.api}/ReservationApi/api/flights/search`,
            oneWayBody,
            {
              headers: {
                Authorization: `Bearer ${item.accessToken}`,
              },
            }
          )
          return {
            name: item.name,
            api: item.api,
            adultCommission: item.adultCommission,
            childCommission: item.childCommission,
            infantCommission: item.infantCommission,
            logo: item.logo,
            data,
          }
        })
      )

      const filteredData = (item: any, airline: string, db: any) => {
        const adultPrice = item?.flightPricings?.find(
          (i: any) => i?.passengerType?.type === 'Adult'
        )
        const childPrice = item?.flightPricings?.find(
          (i: any) => i?.passengerType?.type === 'Child'
        )

        const infantPrice = item?.flightPricings?.find(
          (i: any) => i?.passengerType?.type === 'Infant'
        )

        const prices = [
          {
            flightId: adultPrice?.flightId,
            passenger: adultPrice?.passengerType,
            commission: adultPrice?.commission,
            fare: adultPrice?.fare,
            numberOfSeats: adultPrice?.numberOfSeats,
            numberOfSeatsAvailable: adultPrice?.numberOfSeatsAvailable,
            baggageWeight: adultPrice?.baggageWeight,
            handCarryWeight: adultPrice?.handCarryWeight,
            dbCommission: db.adultCommission,
            totalPrice:
              (adultPrice?.totalFare -
                adultPrice?.commission +
                db.adultCommission) *
              noAdult,
            ...adultPrice,
          },
          {
            flightId: childPrice?.flightId,
            passenger: childPrice?.passengerType,
            commission: childPrice?.commission,
            fare: childPrice?.fare,
            numberOfSeats: childPrice?.numberOfSeats,
            numberOfSeatsAvailable: childPrice?.numberOfSeatsAvailable,
            baggageWeight: childPrice?.baggageWeight,
            handCarryWeight: childPrice?.handCarryWeight,
            dbCommission: db.childCommission,
            totalPrice:
              (childPrice?.totalFare -
                childPrice?.commission +
                db.childCommission) *
              noChild,
            ...childPrice,
          },
          {
            flightId: infantPrice?.flightId,
            passenger: infantPrice?.passengerType,
            commission: infantPrice?.commission,
            fare: infantPrice?.fare,
            numberOfSeats: infantPrice?.numberOfSeats,
            numberOfSeatsAvailable: infantPrice?.numberOfSeatsAvailable,
            baggageWeight: infantPrice?.baggageWeight,
            handCarryWeight: infantPrice?.handCarryWeight,
            dbCommission: db.infantCommission,
            totalPrice:
              (infantPrice?.totalFare -
                infantPrice?.commission +
                db.infantCommission) *
              noInfant,
            ...infantPrice,
          },
        ]

        delete item.flightPricings

        return { prices, flight: item, airline, db }
      }

      const data = flights?.map((item: any) => {
        const newResult = item?.data?.map((i: any) =>
          filteredData(i, item.api, {
            api: item.api,
            logo: item.logo,
            adultCommission: item.adultCommission,
            childCommission: item.childCommission,
            infantCommission: item.infantCommission,
            name: item.name,
          })
        )

        return newResult
      })

      return res.json(data?.flat())
    } catch (error: any) {
      res.status(500).json({ error: error?.response?.data || error?.message })
    }
  }
)

export default handler
