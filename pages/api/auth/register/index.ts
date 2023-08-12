import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
import UserRole from '../../../../models/UserRole'
import { generateToken } from '../../../../utils/auth'

const schemaName = User

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { name, email, password } = req.body

      const object = await schemaName.create({
        name,
        email,
        password,
        confirmed: true,
        blocked: false,
      })

      await Profile.create({
        user: object._id,
        name: object.name,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${object.name}&background=random&color=random&size=128`,
      })

      await UserRole.create({
        user: object._id,
        role: '5e0af1c63b6482125c1b44cb', // Authenticated Role
      })

      const roleObj = await UserRole.findOne({ user: object?._id })
        .lean()
        .sort({ createdAt: -1 })
        .populate({
          path: 'role',
          populate: {
            path: 'clientPermission',
            model: 'ClientPermission',
          },
        })

      if (!roleObj)
        return res
          .status(404)
          .json({ error: 'This user does not have associated role' })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const routes = roleObj?.role?.clientPermission?.map(
        (a: { menu: string; name: string; path: string; sort: number }) => ({
          menu: a?.menu,
          name: a?.name,
          path: a?.path,
          sort: a?.sort,
        })
      )
      return res.send({
        _id: object._id,
        name: object.name,
        email: object.email,
        blocked: object.blocked,
        confirmed: object.confirmed,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        role: roleObj.role.type,
        routes: routes,
        token: generateToken(object._id),
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
