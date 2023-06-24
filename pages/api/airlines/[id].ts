import nc from 'next-connect'
import db from '../../../config/db'
import Airline from '../../../models/Airline'
import { isAuth } from '../../../utils/auth'

const schemaName = Airline
const schemaNameString = 'Airline'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const {
        name,
        api,
        adultCommission,
        childCommission,
        infantCommission,
        logo,
        username,
        password,
        status,
      } = req.body

      const object = await schemaName.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.name = name
      object.api = api
      object.adultCommission = adultCommission
      object.childCommission = childCommission
      object.infantCommission = infantCommission
      object.logo = logo ? logo : object.logo
      object.username = username
      object.password = password

      object.status = status
      await object.save()
      res.status(200).json({ message: `${schemaNameString} updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const object = await schemaName.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      await object.deleteOne()
      res.status(200).json({ message: `${schemaNameString} removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
