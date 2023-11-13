'use server'

import { getEnvVariable } from '@/lib/helpers'
import axios from 'axios'
import { prisma } from '@/lib/prisma.db'
import { IFlight } from '@/types'

export default async function flight({
  date,
  adult,
  child,
  infant,
  fromId,
  toId,
}: {
  date: string
  adult: number
  child: number
  infant: number
  fromId: number
  toId: number
}) {
  try {
    const BASE_URL = getEnvVariable('BASE_URL')

    const airlines = await prisma.airline.findMany({
      where: {
        status: 'ACTIVE',
      },
    })
    if (airlines?.length < 1) throw new Error(`No active airlines`)

    const oneWayBody = {
      departureDate: date?.slice(0, 10),
      arrivalDate: '',
      adultNum: adult,
      childNum: child,
      infantNum: infant,
      requiredSeats: adult + child + infant,
      fromCityId: Number(fromId),
      toCityId: Number(toId),
      timeZoneOffset: '+03:00',
    }

    const flights = await Promise.all(
      airlines?.map(async (item) => {
        const { data } = await axios.post(
          `${BASE_URL}/${item.api}/ReservationApi/api/flights/search`,
          oneWayBody,
          {
            headers: {
              'Content-Type': 'application/json',
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
          passenger: adultPrice?.passengerType?.type,
          commission: db?.adultCommission,
          fare: adultPrice?.fare,
          baggageWeight: adultPrice?.baggageWeight,
          handCarryWeight: adultPrice?.handCarryWeight,
          totalPrice: (adultPrice?.fare + db?.adultCommission) * adult,
        },
        {
          passenger: childPrice?.passengerType?.type,
          commission: db?.childCommission,
          fare: childPrice?.fare,
          baggageWeight: childPrice?.baggageWeight,
          handCarryWeight: childPrice?.handCarryWeight,
          totalPrice: (childPrice?.fare + db?.childCommission) * child,
        },
        {
          passenger: infantPrice?.passengerType?.type,
          commission: db?.infantCommission,
          fare: infantPrice?.fare,
          baggageWeight: infantPrice?.baggageWeight,
          handCarryWeight: infantPrice?.handCarryWeight,
          totalPrice: (infantPrice?.fare + db?.infantCommission) * infant,
        },
      ]

      const flight = {
        segmentNumber: 1,
        ticketTypeId: 1,
        flightRouteId: item?.flightRouteId,
        flightScheduleId: item?.flightScheduleId,
        departureDate:
          item?.departureDate?.slice(0, 10) + ' ' + item?.departureTime,
        arrivalDate: item?.arrivalDate?.slice(0, 10) + ' ' + item?.arrivalTime,
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

      return { prices, flight, airline: airlineInfo, adult, child, infant }
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

    // remove flight with no seats
    const results: IFlight[] = data
      ?.flat()
      ?.filter(
        (item: any) =>
          item?.flight?.adultNumberOfSeatsAvailable > 0 ||
          item?.flight?.childNumberOfSeatsAvailable > 0
      )
    return results
  } catch (error: any) {
    throw new Error(`Error fetching flights: ${error?.message}`)
  }
}
