import { create } from 'zustand'

export type Flight = {
  prices?: any[]
  airline?: string
  flight?: any
}

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
  flight: Flight
  setFlight: (flight: Flight[]) => void
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
  flight: {},
  passengers: [],
  contact: {
    email: '',
    phone: '',
  },
  setFlight: (flight: Flight[]) => {
    set((state) => ({
      flight: { ...state.flight, ...flight },
    }))
  },
  setPassengers: (passengers: Passenger[]) => {
    set(() => ({
      passengers: passengers,
    }))
  },
  setContact: (contact: { email: string; phone: string }) => {
    set((state) => ({
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
              : item
          )
          ?.filter((item) => item) || []

      const childValue =
        state.passengers[0]?.child
          ?.map((item) =>
            item.id === passenger.id
              ? {
                  ...passenger,
                }
              : item
          )
          ?.filter((item) => item) || []

      const infantValue =
        state.passengers[0]?.infant
          ?.map((item) =>
            item.id === passenger.id
              ? {
                  ...passenger,
                }
              : item
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
