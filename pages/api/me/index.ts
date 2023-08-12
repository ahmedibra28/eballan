import axios from 'axios'
import nc from 'next-connect'
import Airline from '../../../models/Airline'
import { login } from '../../../utils/help'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { airline } = req.query
      const { BASE_URL } = process.env

      const airlineQuery = await Airline.findOne({ api: airline })
      if (!airlineQuery)
        return res.status(400).json({ error: 'Invalid airline' })

      const auth = await login(
        airlineQuery.api,
        airlineQuery.username,
        airlineQuery.password
      )

      const { data } = await axios.get(
        `${BASE_URL}/${airline}/ReservationApi/api/users/basic`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      )

      return res.json(data)
    } catch (error: any) {
      res.status(500).json({ error: error.response.data || error.message })
    }
  }
)

export default handler
