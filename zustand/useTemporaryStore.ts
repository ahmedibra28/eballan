import { ICity } from '@/types'
import { create } from 'zustand'

type useTemporaryStore = {
  fromCity: ICity | null
  toCity: ICity | null
  updateFromCity: (city: ICity) => void
  updateToCity: (city: ICity) => void
}

const useTemporaryStore = create<useTemporaryStore>((set) => ({
  fromCity: null,
  toCity: null,
  updateFromCity: (fromCity: ICity) => {
    return set(() => ({
      fromCity: fromCity,
    }))
  },
  updateToCity: (toCity: ICity) => {
    return set(() => ({
      toCity: toCity,
    }))
  },
}))

export default useTemporaryStore
