import axios from 'axios'
import nc from 'next-connect'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { airline } = req.query
      const { BASE_URL } = process.env

      const { data } = await axios.get(
        `${BASE_URL}/${airline}/ReservationApi/api/common/cities`
      )

      let newData = data?.filter((item: any) => item.countryName === 'SOMALIA')

      newData = newData.sort((a: any, b: any) => {
        return a.name.localeCompare(b.name)
      })

      newData = newData?.filter((item: any) => {
        return item.name !== 'Baydhabo'
      })

      return res.json(newData)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
