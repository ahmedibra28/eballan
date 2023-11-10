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
    return data as ICountry[]
  } catch (error: any) {
    throw new Error(`Error fetching countries: ${error?.message}`)
  }
}
