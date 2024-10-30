'use server'

import { getEnvVariable } from '@/lib/helpers'
import { ICountry } from '@/types'
import axios from 'axios'

export default async function country() {
  try {
    const BASE_URL = getEnvVariable('BASE_URL')

    const { data } = await axios.get(
      `${BASE_URL}/saacid/ReservationApi/api/countries`
    )

    const filteredData = data?.filter(
      (item: ICountry) => item.name?.toLowerCase() !== 'somaliland'
    )
    return filteredData as ICountry[]
  } catch (error: any) {
    return { error: `Error fetching countries: ${error?.message}` }
  }
}
