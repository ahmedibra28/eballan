import { create } from 'zustand'
import { IFlight } from '../types'

export type Passenger = {
  id: string
  firstName: string
  secondName: string
  lastName: string
  nationality: string
  sex: string
  dob: string
  passportNumber: string
  passportExpiryDate: string
  passengerTitle: string
}

type FlightStore = {
  flight: IFlight
  setFlight: (flight: IFlight) => void
  passengers: {
    adult: Passenger[]
    child: Passenger[]
    infant: Passenger[]
  }[]
  setPassengers: (passenger: Passenger[]) => void
  contact: {
    email: string
    phone: string
  }
  setContact: (contact: { email: string; phone: string }) => void
  updatePassenger: (passenger: {
    adult: Passenger[]
    child: Passenger[]
    infant: Passenger[]
  }) => void
}

const useFlightStore = create<FlightStore>((set) => ({
  // @ts-ignore
  flight: {},
  passengers: [],
  contact: {
    email: '',
    phone: '',
  },
  setFlight: (flight: IFlight) => {
    set((state) => ({
      flight: { ...state.flight, ...flight },
    }))
  },
  setPassengers: (passengers: Passenger[]) => {
    // @ts-ignore
    set(() => ({
      passengers: passengers,
    }))
  },
  setContact: (contact: { email: string; phone: string }) => {
    set(() => ({
      contact,
    }))
  },

  updatePassenger: (passenger: any) => {
    set((state) => {
      const adultValue =
        state.passengers[0]?.adult
          ?.map((item) =>
            item.id === passenger.id
              ? {
                  ...passenger,
                }
              : item,
          )
          ?.filter((item) => item) || []

      const childValue =
        state.passengers[0]?.child
          ?.map((item) =>
            item.id === passenger.id
              ? {
                  ...passenger,
                }
              : item,
          )
          ?.filter((item) => item) || []

      const infantValue =
        state.passengers[0]?.infant
          ?.map((item) =>
            item.id === passenger.id
              ? {
                  ...passenger,
                }
              : item,
          )
          ?.filter((item) => item) || []

      const updatedPassengers = [
        {
          adult: adultValue,
          child: childValue,
          infant: infantValue,
        },
      ]

      return {
        passengers: updatedPassengers,
      }
    })
  },
}))

export default useFlightStore
