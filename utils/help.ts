import axios from 'axios'
import LoginInfo from '../models/LoginInfo'

export const AVAILABLE_AIRLINES = ['maandeeqair', 'halla']

type Auth = {
  [key: string]: {
    username: string
    password: string
  }
}
const auth: Auth = {
  maandeeqair: {
    username: 'eballan',
    password: 'eBallan2022',
  },
  halla: {
    username: 'Eballanmgq',
    password: 'eBallan2022',
  },
}

export const login = async (airline: string) => {
  const { BASE_URL } = process.env

  const loginObj = await LoginInfo.findOne({
    accessTokenExpiry: { $gt: Date.now() },
    airline,
  })

  if (loginObj) return loginObj

  if (!loginObj) {
    await LoginInfo.findOneAndDelete({ airline })

    const { data } = await axios.post(
      `${BASE_URL}/${airline}/Core/api/login`,
      {
        username: auth[airline].username,
        password: auth[airline].password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return await LoginInfo.create({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiry: Date.now() + 60 * (60 * 1000),
      airline,
    })
  }
}
