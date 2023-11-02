import { create } from 'zustand'
import { IFlight } from '../types'

export type SearchFlight = {
  fromDate?: string
  toDate?: string
  trip?: string
  originCity?: string
  destinationCity?: string
  seatType?: string
  noAdult?: number
  noChild?: number
  noInfant?: number
  result?: IFlight[]
}

type SearchFlightStore = {
  searchFlight: SearchFlight
  updateSearchFlight: (searchFlight: SearchFlight[]) => void
}

const useSearchFlightStore = create<SearchFlightStore>((set) => ({
  searchFlight: {},
  updateSearchFlight: (searchFlight: SearchFlight[]) => {
    set((state) => ({
      searchFlight: { ...state.searchFlight, ...searchFlight },
    }))
  },
}))

export default useSearchFlightStore
