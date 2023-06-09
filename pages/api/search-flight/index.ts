import axios from 'axios'
import nc from 'next-connect'
import { login } from '../../../utils/help'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      // const { airline } = req.query
      const { BASE_URL } = process.env

      // if (!AVAILABLE_AIRLINES.includes(airline as string)) {
      //   return res.status(400).json({ error: 'Invalid airline' })
      // }

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

      const roundBody = {
        departureDate: toDate?.slice(0, 10),
        arrivalDate: toDate?.slice(0, 10),
        adultNum: noAdult,
        childNum: noChild,
        infantNum: noInfant,
        requiredSeats: noAdult + noChild + noInfant,
        fromCityId: Number(destinationCity),
        toCityId: Number(originCity),
        timeZoneOffset: '+03:00',
      }

      const authMaandeeqAir = await login('maandeeqair')
      const authHalla = await login('halla')

      const { data: maandeeqair } = await axios.post(
        `${BASE_URL}/maandeeqair/ReservationApi/api/flights/search`,
        oneWayBody,
        {
          headers: {
            Authorization: `Bearer ${authMaandeeqAir.accessToken}`,
          },
        }
      )

      let returnValueMaandeeqAir: any = null
      if (req.body?.trip === 'Return') {
        const { data: maandeeqair2 } = await axios.post(
          `${BASE_URL}/maandeeqair/ReservationApi/api/flights/search`,
          roundBody,
          {
            headers: {
              Authorization: `Bearer ${authMaandeeqAir.accessToken}`,
            },
          }
        )

        if (maandeeqair2?.length > 0) {
          returnValueMaandeeqAir = {
            departureDate: maandeeqair2?.[0]?.departureDate,
            departureTime: maandeeqair2?.[0]?.departureTime,
            arrivalDate: maandeeqair2?.[0]?.arrivalDate,
            arrivalTime: maandeeqair2?.[0]?.arrivalTime,
            toCityCode: maandeeqair2?.[0]?.toCityCode,
            fromCityCode: maandeeqair2?.[0]?.fromCityCode,
          }
        }
      }

      const { data: halla } = await axios.post(
        `${BASE_URL}/halla/ReservationApi/api/flights/search`,
        oneWayBody,
        {
          headers: {
            Authorization: `Bearer ${authHalla.accessToken}`,
          },
        }
      )

      let returnValueHalla: any = null

      if (req.body?.trip === 'Return') {
        const { data: halla2 } = await axios.post(
          `${BASE_URL}/halla/ReservationApi/api/flights/search`,
          roundBody,
          {
            headers: {
              Authorization: `Bearer ${authHalla.accessToken}`,
            },
          }
        )

        if (halla2?.length > 0) {
          returnValueHalla = {
            departureDate: halla2?.[0]?.departureDate,
            departureTime: halla2?.[0]?.departureTime,
            arrivalDate: halla2?.[0]?.arrivalDate,
            arrivalTime: halla2?.[0]?.arrivalTime,
            toCityCode: halla2?.[0]?.toCityCode,
            fromCityCode: halla2?.[0]?.fromCityCode,
          }
        }
      }

      // console.log({
      //   returnValueMaandeeqAir,
      //   returnValueHalla,
      // })

      const filteredData = (item: any, airline: string) => {
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
            totalPrice: adultPrice?.totalFare * noAdult,
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
            totalPrice: childPrice?.totalFare * noChild,
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
            totalPrice: infantPrice?.totalFare * noInfant,
            ...infantPrice,
          },
        ]

        delete item.flightPricings

        const arrival =
          airline === 'Maandeeq Air'
            ? returnValueMaandeeqAir
            : airline === 'Halla'
            ? returnValueHalla
            : null

        return { prices, flight: item, airline, arrival }
      }

      const newResultMaandeeqAir = maandeeqair?.map((item: any) =>
        filteredData(item, 'Maandeeq Air')
      )

      const newResultHalla = halla?.map((item: any) =>
        filteredData(item, 'Halla')
      )

      const data = [...newResultMaandeeqAir, ...newResultHalla]

      return res.json(data)
    } catch (error: any) {
      res.status(500).json({ error: error.response.data || error.message })
    }
  }
)

export default handler
