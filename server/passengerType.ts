'use server'

import { getEnvVariable } from '@/lib/helpers'
import { IPassengerType } from '@/types'
import axios from 'axios'

export default async function passengerType() {
  try {
    const BASE_URL = getEnvVariable('BASE_URL')

    const { data } = await axios.get(
      `${BASE_URL}/saacid/ReservationApi/api/common/passengerTypes`
    )
    return data as IPassengerType[]
  } catch (error: any) {
    return { error: `Error fetching passenger types: ${error?.message}` }
  }
}
