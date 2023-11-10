'use server'

import { getEnvVariable } from '@/lib/helpers'
import { ICity } from '@/types'
import axios from 'axios'

export default async function city() {
  try {
    const BASE_URL = getEnvVariable('BASE_URL')

    const { data } = await axios.get(
      `${BASE_URL}/saacid/ReservationApi/api/common/cities`
    )

    let newData = data.sort((a: any, b: any) => {
      return a.name.localeCompare(b.name)
    })

    const disabledCities = [
      'Aweil',
      'Dessie',
      'Haramoge',
      'Khunda',
      'Kuacjok',
      'Malakal',
      'Rabkona',
      'Renk',
      'Rumbek',
      'Wau',
      'Yida',
      'Baydhabo',
      'Ajunthok',
    ]

    const result: ICity[] = newData?.filter((item: any) => {
      return !disabledCities.includes(item.name.trim())
    })

    return result
  } catch (error: any) {
    throw new Error(`Error fetching cities: ${error?.message}`)
  }
}
