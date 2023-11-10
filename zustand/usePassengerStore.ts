import { IPassenger } from '@/types'
import { create } from 'zustand'

type usePassengerStore = {
  passenger: IPassenger | null
  updatePassenger: (passenger: IPassenger) => void
}

const usePassengerStore = create<usePassengerStore>((set) => ({
  passenger: null,
  updatePassenger: (passenger: IPassenger) => {
    return set(() => ({
      passenger: passenger,
    }))
  },
}))

export default usePassengerStore
