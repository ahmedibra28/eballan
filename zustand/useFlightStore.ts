import { IFlight } from '@/types'
import { create } from 'zustand'

type useFlightStore = {
  flight: IFlight | null
  updateFlight: (flight: IFlight) => void
}

const useFlightStore = create<useFlightStore>((set) => ({
  flight: null,
  updateFlight: (flight: IFlight) => {
    return set(() => ({
      flight: flight,
    }))
  },
}))

export default useFlightStore
