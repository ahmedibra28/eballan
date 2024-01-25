'use server'

import {
  useCreateInvoice as CreateInvoice,
  useVerifyInvoice as VerifyInvoice,
} from '@/hooks/useEDahabPayment'
import { useEVCPayment as EVCPayment } from '@/hooks/useEVCPayment'
import DateTime from '@/lib/dateTime'
import { getEnvVariable } from '@/lib/helpers'
import { IPassenger, IFlight, IInsertToDB, ICountry } from '@/types'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma.db'

export default async function book({
  passenger,
  flight,
  payment,
  link,
  createdById,
  dealerCode,
  status,
}: {
  passenger: IPassenger
  flight: IFlight
  payment: { phone: string; paymentMethod: string }
  link?: string
  createdById?: string
  dealerCode?: string
  status?: 'invoice' | 'verify'
}) {
  try {
    const BASE_URL = getEnvVariable('BASE_URL')

    if (!payment.phone) throw new Error('Invalid phone')
    if (payment.phone.slice(0, 1) === '0') {
      payment.phone = payment.phone.substring(1)
    }

    if (payment.phone.slice(0, 3) === '252') {
      payment.phone = payment.phone.substring(3)
    }

    if (payment.phone.length !== 9)
      throw new Error('Phone number must be 9 digits')

    const totalPrice =
      flight?.prices?.reduce((acc, cur) => acc + cur?.totalPrice, 0) || 0

    if (totalPrice < 1) throw new Error('Invalid amount')

    // Edahab Implementation
    if (
      payment.paymentMethod?.toLowerCase() === 'somtel' &&
      status === 'invoice'
    ) {
      const createInvoice = await CreateInvoice(
        payment.phone,
        Number(totalPrice)
      )
      if (createInvoice?.StatusCode !== 0)
        throw new Error(createInvoice?.StatusDescription)

      const link = `https://edahab.net/api/payment?invoiceId=${createInvoice.InvoiceId}`

      return { message: `success`, link }
    }

    if (
      payment.paymentMethod?.toLowerCase() === 'somtel' &&
      status === 'verify' &&
      link
    ) {
      const invoiceId = link?.split('invoiceId=')[1]
      const verifyInvoice = await VerifyInvoice(Number(invoiceId))

      if (verifyInvoice?.InvoiceStatus !== 'Paid')
        throw new Error(
          `Please pay ${verifyInvoice?.InvoiceStatus?.toLowerCase()} invoice first`
        )
    }

    // handle EVC payment
    if (
      payment.paymentMethod?.toLowerCase() === 'hormuud' ||
      payment.paymentMethod?.toLowerCase() === 'somnet'
    ) {
      const MERCHANT_U_ID = getEnvVariable('MERCHANT_U_ID')
      const API_USER_ID = getEnvVariable('API_USER_ID')
      const API_KEY = getEnvVariable('API_KEY')
      const MERCHANT_ACCOUNT_NO = getEnvVariable('MERCHANT_ACCOUNT_NO')

      // if (payment.phone !== '770022200') {
      const paymentInfo = await EVCPayment({
        merchantUId: MERCHANT_U_ID,
        apiUserId: API_USER_ID,
        apiKey: API_KEY,
        customerMobileNumber: `252${payment.phone}`,
        description: `${payment.phone} has paid ${totalPrice} for flight reservation`,
        amount: 0.1,
        withdrawTo: 'MERCHANT',
        withdrawNumber: MERCHANT_ACCOUNT_NO,
      })
      if (paymentInfo.responseCode !== '2001') throw new Error('Payment failed')
    }

    const { data: countries } = await axios.get(
      `${BASE_URL}/saacid/ReservationApi/api/countries`
    )

    let readyToBook = {
      bookingTypeId: 1,
      paymentStatusId: 2,
      reservationStatusId: 1,
      passengers: [
        passenger?.adult?.length > 0 && {
          ...passenger.adult?.map((item) => ({
            firstName: item.firstName,
            lastName: item.lastName,
            passportNo: '',
            dob: DateTime(item.dob).format(),
            countryId:
              countries?.find(
                (x: ICountry) =>
                  x?.name?.toLowerCase() === item?.country?.toLowerCase()
              )?.id || 196,
            passengerTypeId: 1, // Adult
            passengerTitleId: item.passengerTitle,
            reservationDetails: [
              {
                segmentNumber: 1,
                ticketTypeId: 1,
                flightRouteId: flight.flight.flightRouteId,
                flightScheduleId: flight.flight.flightScheduleId,
              },
            ],
          })),
        },

        passenger?.child?.length > 0 && {
          ...passenger.child?.map((item) => ({
            firstName: item.firstName,
            lastName: item.lastName,
            passportNo: '',
            dob: DateTime(item.dob).format(),
            countryId:
              countries?.find(
                (x: ICountry) =>
                  x?.name?.toLowerCase() === item?.country?.toLowerCase()
              )?.id || 196,
            passengerTypeId: 2, // Child
            passengerTitleId: item.passengerTitle,
            reservationDetails: [
              {
                segmentNumber: 1,
                ticketTypeId: 1,
                flightRouteId: flight.flight.flightRouteId,
                flightScheduleId: flight.flight.flightScheduleId,
              },
            ],
          })),
        },
        passenger?.infant?.length > 0 && {
          ...passenger.infant?.map((item) => ({
            firstName: item.firstName,
            lastName: item.lastName,
            passportNo: '',
            dob: DateTime(item.dob).format(),
            countryId:
              countries?.find(
                (x: ICountry) =>
                  x?.name?.toLowerCase() === item?.country?.toLowerCase()
              )?.id || 196,
            passengerTypeId: 3, // Infant
            passengerTitleId: item.passengerTitle,
            reservationDetails: [
              {
                segmentNumber: 1,
                ticketTypeId: 1,
                flightRouteId: flight.flight.flightRouteId,
                flightScheduleId: flight.flight.flightScheduleId,
              },
            ],
          })),
        },
      ],
      contactInformation: {
        email: passenger?.contact?.email,
        phone: passenger?.contact?.phone,
      },
    }

    readyToBook = {
      ...readyToBook,
      passengers: readyToBook?.passengers
        ?.filter((item: any) => item)
        ?.map((item) => Object.values(item))
        ?.flat(),
    }

    let airline = await prisma.airline.findFirst({
      where: {
        status: 'ACTIVE',
        api: `${flight.airline?.key}`,
      },
    })
    if (!airline) throw new Error(`No active airline`)

    if ((airline?.accessTokenExpiry || 0) <= Date.now()) {
      const { data } = await axios.post(
        `${BASE_URL}/${airline?.api}/Core/api/login`,
        {
          username: airline?.username,
          password: airline?.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!data) throw new Error(`Failed to login to ${airline?.name}`)

      await prisma.airline.update({
        where: { id: `${airline?.id}` },
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpiry: Date.now() + 60 * (60 * 1000),
        },
      })
    }

    airline = await prisma.airline.findFirst({
      where: {
        status: 'ACTIVE',
        api: flight.airline?.key,
        id: airline?.id,
      },
    })

    const { data } = await axios.post(
      `${BASE_URL}/${airline?.api}/ReservationApi/api/bookings/AddConfirmBooking`,
      readyToBook,
      {
        headers: {
          Authorization: `Bearer ${airline?.accessToken}`,
          uuid: uuidv4(),
          scheme: 'https',
          platform: 1,
        },
      }
    )

    // const data = {
    //   pnrNumber: Math.random().toString(36).substring(2, 9)?.toString(),
    //   reservationId: Number(Math.random().toString().substring(2, 7)),
    // }

    let forDatabase = {
      passengers: [
        passenger?.adult?.length > 0 && {
          ...passenger?.adult?.map((item) => ({
            ...item,
            passengerType: 'Adult',
            countryId:
              countries?.find(
                (x: ICountry) =>
                  x?.name?.toLowerCase() === item?.country?.toLowerCase()
              )?.id || 196,
          })),
        },
        passenger?.child?.length > 0 && {
          ...passenger?.child?.map((item) => ({
            ...item,
            passengerType: 'Child',
            countryId:
              countries?.find(
                (x: ICountry) =>
                  x?.name?.toLowerCase() === item?.country?.toLowerCase()
              )?.id || 196,
          })),
        },
        passenger?.infant?.length > 0 && {
          ...passenger?.infant?.map((item) => ({
            ...item,
            passengerType: 'Infant',
            countryId:
              countries?.find(
                (x: ICountry) =>
                  x?.name?.toLowerCase() === item?.country?.toLowerCase()
              )?.id || 196,
          })),
        },
      ],
      prices: [
        passenger?.adult?.length > 0
          ? flight?.prices?.find((item) => item.passenger === 'Adult')
          : undefined,
        passenger?.child?.length > 0
          ? flight?.prices?.find((item) => item.passenger === 'Child')
          : undefined,
        passenger?.infant?.length > 0
          ? flight?.prices?.find((item) => item.passenger === 'Infant')
          : undefined,
      ],
      flight: { ...flight?.flight, airlineId: airline?.id },
      adult: flight?.adult,
      child: flight?.child,
      infant: flight?.infant,
      paymentPhone: payment?.phone,
      paymentMethod: payment?.paymentMethod,
      contactPhone: passenger?.contact?.phone,
      contactEmail: passenger?.contact?.email,
      reservationId: data?.reservationId,
      pnrNumber: data?.pnrNumber,
      status: 'BOOKED',
      createdById,
      dealerCode,
    }

    forDatabase = {
      ...forDatabase,
      passengers: forDatabase?.passengers
        ?.filter((item: any) => item)
        ?.map((item) => Object.values(item))
        ?.flat()
        ?.map((item) => {
          delete item?.id
          return item
        }),
      prices: forDatabase?.prices?.filter((item: any) => item),
    }

    // @ts-ignore
    const obj: IInsertToDB = forDatabase

    await prisma.$transaction(async (prisma) => {
      // Insert passengers
      const passengers = await Promise.all(
        obj.passengers.map(async (passenger) => {
          const p = await prisma.passenger.create({
            data: passenger,
          })
          return p
        })
      )

      // Insert prices
      const prices = await Promise.all(
        obj.prices.map(async (price) => {
          const p = await prisma.price.create({
            data: price,
          })
          return p
        })
      )

      // Insert flight
      const flight = await prisma.flight.create({
        data: obj.flight,
      })
      // Insert reservation
      await prisma.reservation.create({
        data: {
          reservationId: obj?.reservationId,
          pnrNumber: obj?.pnrNumber,
          status: 'BOOKED',
          adult: obj?.adult,
          child: obj?.child,
          infant: obj?.infant,
          paymentPhone: obj?.paymentPhone,
          contactPhone: obj?.contactPhone,
          contactEmail: obj?.contactEmail,
          dealerCode: obj?.dealerCode,
          paymentMethod: obj?.paymentMethod,
          ...(obj.createdById && { createdById: obj.createdById }),
          flightId: flight.id,
          passengers: {
            connect: passengers.map((passenger) => ({ id: passenger.id })),
          },
          prices: {
            connect: prices.map((price) => ({ id: price.id })),
          },
        },
      })
    })

    return {
      reservationId: data?.reservationId,
      pnrNumber: data?.pnrNumber,
    }
  } catch (error: any) {
    throw new Error(`Error booking reservation: ${error?.message}`)
  }
}
