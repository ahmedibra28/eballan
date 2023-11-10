import { IFlight } from '@/types'
import { create } from 'zustand'

type useFlightsStore = {
  flights: IFlight[]
  updateFlights: (flights: IFlight[]) => void
}

const useFlightsStore = create<useFlightsStore>((set) => ({
  flights: [],
  updateFlights: (flights: IFlight[]) => {
    return set(() => ({
      flights: flights,
    }))
  },
}))

export default useFlightsStore
