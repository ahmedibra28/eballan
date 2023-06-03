import axios from 'axios'

export const AVAILABLE_AIRLINES = ['maandeeqair']

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
}

export const login = async (airline: string) => {
  const { BASE_URL } = process.env

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

  return data
}
