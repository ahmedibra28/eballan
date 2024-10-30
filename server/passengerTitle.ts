'use server'

import { getEnvVariable } from '@/lib/helpers'
import { IPassengerTitle } from '@/types'
import axios from 'axios'

export default async function passengerTitle() {
  try {
    const BASE_URL = getEnvVariable('BASE_URL')

    const { data } = await axios.get(
      `${BASE_URL}/saacid/ReservationApi/api/common/passengerTitles`
    )
    return data as IPassengerTitle[]
  } catch (error: any) {
    return { error: `Error fetching passenger titles: ${error?.message}` }
  }
}
