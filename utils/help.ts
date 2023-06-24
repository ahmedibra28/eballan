import axios from 'axios'
import LoginInfo from '../models/LoginInfo'
import db from '../config/db'

export const login = async (
  airline: string,
  username: string,
  password: string
) => {
  const { BASE_URL } = process.env

  await db()

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
        username,
        password,
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
