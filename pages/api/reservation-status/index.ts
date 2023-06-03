import axios from 'axios'
import nc from 'next-connect'
import { AVAILABLE_AIRLINES, login } from '../../../utils/help'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { airline } = req.query
      const { BASE_URL } = process.env

      if (!AVAILABLE_AIRLINES.includes(airline as string)) {
        return res.status(400).json({ error: 'Invalid airline' })
      }

      const auth = await login(airline)

      const { data } = await axios.get(
        `${BASE_URL}/${airline}/ReservationApi/api/common/reservationStatuses`,
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
