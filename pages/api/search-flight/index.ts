import axios from 'axios'
import nc from 'next-connect'
import { login } from '../../../utils/help'
import db from '../../../config/db'
import Airline from '../../../models/Airline'
import { LoginAirline } from '../../../types'

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
        originCity,
        destinationCity,
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

      const loginData = (await Promise.all(
        airlines.map(async (item: any) => {
          const data = await login(item.api, item.username, item.password)
          return {
            ...item,
            accessToken: data?.accessToken,
          }
        }),
      )) as LoginAirline[]

      const flights = await Promise.all(
        loginData?.map(async (item) => {
          const { data } = await axios.post(
            `${BASE_URL}/${item.api}/ReservationApi/api/flights/search`,
            oneWayBody,
            {
              headers: {
                Authorization: `Bearer ${item.accessToken}`,
              },
            },
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
        }),
      )

      // console.log(JSON.stringify(flights[0]))

      const filteredData = (item: any, airline: string, db: any) => {
        const adultPrice = item?.flightPricings?.find(
          (i: any) => i?.passengerType?.type === 'Adult',
        )

        const childPrice = item?.flightPricings?.find(
          (i: any) => i?.passengerType?.type === 'Child',
        )

        const infantPrice = item?.flightPricings?.find(
          (i: any) => i?.passengerType?.type === 'Infant',
        )

        const prices = [
          {
            passenger: adultPrice?.passengerType?.type,
            commission: db?.adultCommission,
            fare: adultPrice?.fare,
            baggageWeight: adultPrice?.baggageWeight,
            handCarryWeight: adultPrice?.handCarryWeight,
            totalPrice: (adultPrice?.fare + db?.adultCommission) * noAdult,
          },
          {
            passenger: childPrice?.passengerType?.type,
            commission: db?.childCommission,
            fare: childPrice?.fare,
            baggageWeight: childPrice?.baggageWeight,
            handCarryWeight: childPrice?.handCarryWeight,
            totalPrice: (childPrice?.fare + db?.childCommission) * noChild,
          },
          {
            passenger: infantPrice?.passengerType?.type,
            commission: db?.infantCommission,
            fare: infantPrice?.fare,
            baggageWeight: infantPrice?.baggageWeight,
            handCarryWeight: infantPrice?.handCarryWeight,
            totalPrice: (infantPrice?.fare + db?.infantCommission) * noInfant,
          },
        ]

        const flight = {
          segmentNumber: 1,
          ticketTypeId: 1,
          flightRouteId: item?.flightRouteId,
          flightScheduleId: item?.flightScheduleId,
          departureDate:
            item?.departureDate?.slice(0, 10) + ' ' + item?.departureTime,
          arrivalDate:
            item?.arrivalDate?.slice(0, 10) + ' ' + item?.arrivalTime,
          fromCityName: item?.fromCityName,
          toCityName: item?.toCityName,
          fromAirportName: item?.fromAirportName,
          toAirportName: item?.toAirportName,
          fromCityCode: item?.fromCityCode,
          toCityCode: item?.toCityCode,
          fromCountryName: item?.fromCountryName,
          toCountryName: item?.toCountryName,
          fromCountryId: item?.fromCountryId,
          toCountryId: item?.toCountryId,
          fromCountryIsoCode3: item?.fromCountryIsoCode3,
          toCountryIsoCode3: item?.toCountryIsoCode3,
          adultNumberOfSeatsAvailable: adultPrice?.numberOfSeatsAvailable,
          childNumberOfSeatsAvailable: childPrice?.numberOfSeatsAvailable,
        }

        const airlineInfo = {
          key: airline,
          name: db?.name,
          logo: db?.logo,
        }

        return { prices, flight, airline: airlineInfo }
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
          }),
        )

        return newResult
      })

      // remove flight with no seats
      const results = data
        ?.flat()
        ?.filter(
          (item: any) =>
            item?.flight?.adultNumberOfSeatsAvailable > 0 ||
            item?.flight?.childNumberOfSeatsAvailable > 0,
        )

      return res.json(results)
    } catch (error: any) {
      res.status(500).json({ error: error?.response?.data || error?.message })
    }
  },
)

export default handler
