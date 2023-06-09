import { Schema, model, models } from 'mongoose'
import User from './User'

interface Passenger {
  passengerTitle: string
  firstName: string
  secondName: string
  lastName: string
  nationality: string
  sex: string
  dob: string
  passportNumber: string
  passportExpiryDate: string
}

interface Price {
  commission: number
  fare: number
  passengerType: string
}

interface Flight {
  departureDate: string
  fromCityName: string
  fromCityCode: string
  fromAirportName: string
  fromCountryName: string
  arrivalDate: string
  toCityName: string
  toCityCode: string
  toAirportName: string
  toCountryName: string
  airline: string
  reservationId: string
  pnrNumber: string
}

interface Contact {
  email: string
  phone: string
}

interface Payment {
  phone: string
  paymentMethod: string
}

export interface IReservation {
  _id: Schema.Types.ObjectId
  passengers: {
    child?: Passenger[]
    adult?: Passenger[]
    infant?: Passenger[]
  }
  prices: Price[]
  flight: Flight
  contact: Contact
  payment: Payment
  status: 'booked' | 'canceled'
  createdAt?: Date
  user?: Schema.Types.ObjectId
}

const reservationSchema = new Schema<IReservation>(
  {
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    passengers: {
      adult: [
        {
          passengerTitle: { type: String, required: true },
          firstName: { type: String, required: true },
          secondName: { type: String, required: true },
          lastName: { type: String, required: true },
          nationality: { type: String, required: true },
          sex: { type: String, required: true },
          dob: { type: String, required: true },
          passportNumber: { type: String, required: true },
          passportExpiryDate: { type: String, required: true },
        },
      ],
      child: [
        {
          passengerTitle: { type: String, required: true },
          firstName: { type: String, required: true },
          secondName: { type: String, required: true },
          lastName: { type: String, required: true },
          nationality: { type: String, required: true },
          sex: { type: String, required: true },
          dob: { type: String, required: true },
          passportNumber: { type: String, required: true },
          passportExpiryDate: { type: String, required: true },
        },
      ],
      infant: [
        {
          passengerTitle: { type: String, required: true },
          firstName: { type: String, required: true },
          secondName: { type: String, required: true },
          lastName: { type: String, required: true },
          nationality: { type: String, required: true },
          sex: { type: String, required: true },
          dob: { type: String, required: true },
          passportNumber: { type: String, required: true },
          passportExpiryDate: { type: String, required: true },
        },
      ],
    },
    prices: [
      {
        commission: Number,
        fare: Number,
        passengerType: String,
      },
    ],
    flight: {
      departureDate: String,
      fromCityName: String,
      fromCityCode: String,
      fromAirportName: String,
      fromCountryName: String,
      arrivalDate: String,
      toCityName: String,
      toCityCode: String,
      toAirportName: String,
      toCountryName: String,
      airline: String,
      reservationId: String,
      pnrNumber: String,
    },
    contact: {
      email: String,
      phone: String,
    },
    payment: {
      phone: String,
      paymentMethod: String,
    },
    status: {
      type: String,
      enum: ['booked', 'canceled'],
      default: 'booked',
    },
  },
  { timestamps: true }
)

const Reservation =
  models.Reservation || model('Reservation', reservationSchema)

export default Reservation
