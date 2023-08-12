'use strict'
import nc from 'next-connect'
import User from '../../../../models/User'
import Profile from '../../../../models/Profile'
import Role from '../../../../models/Role'
import Permission from '../../../../models/Permission'
import UserRole from '../../../../models/UserRole'
import ClientPermission from '../../../../models/ClientPermission'

import db from '../../../../config/db'

import {
  users,
  profile,
  roles,
  permissions,
  clientPermissions,
} from '../../../../config/data'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { secret, option } = req.query as any

      if (!secret || secret !== 'ts')
        return res.status(401).json({ error: 'Invalid secret' })

      // Check duplicate permissions
      permissions.map((p) => {
        if (p.method && p.route) {
          const duplicate = permissions.filter(
            (p2) => p2.method === p.method && p2.route === p.route
          )
          if (duplicate.length > 1) {
            return res
              .status(500)
              .json({ error: `Duplicate permission: ${p.method} ${p.route}` })
          }
        }
      })

      // Delete all existing data
      if (option === 'reset') {
        await Promise.all([
          User.deleteMany({}),
          Profile.deleteMany({}),
          Role.deleteMany({}),
          Permission.deleteMany({}),
          UserRole.deleteMany({}),
          ClientPermission.deleteMany({}),
        ])
      }

      // Create users
      let userObject = await User.findById(users._id)
      if (userObject) {
        userObject.name = users.name
        userObject.email = users.email
        userObject.password = users.password
        userObject.confirmed = true
        userObject.blocked = false
      } else {
        userObject = await User.create({
          _id: users._id,
          name: users.name,
          email: users.email,
          password: users.password,
          confirmed: true,
          blocked: false,
        })
      }

      // Create profiles for users
      await Profile.findOneAndUpdate(
        { _id: profile._id },
        {
          _id: profile._id,
          user: userObject._id,
          name: userObject.name,
          address: profile.address,
          mobile: profile.mobile,
          bio: profile.bio,
          image: `https://ui-avatars.com/api/?uppercase=true&name=${userObject.name}&background=random&color=random&size=128`,
        },
        { new: true, upsert: true }
      )

      const [permissionsObj, clientPermissionsObj, roleObj] = await Promise.all(
        [
          // Create permissions
          await Promise.all(
            permissions?.map(
              async (obj) =>
                await Permission.findOneAndUpdate({ _id: obj._id }, obj, {
                  new: true,
                  upsert: true,
                })
            )
          ),
          // Create client permissions
          await Promise.all(
            clientPermissions?.map(
              async (obj) =>
                await ClientPermission.findOneAndUpdate({ _id: obj._id }, obj, {
                  new: true,
                  upsert: true,
                })
            )
          ),
          // Create roles
          await Promise.all(
            roles?.map(
              async (obj) =>
                await Role.findOneAndUpdate({ _id: obj._id }, obj, {
                  new: true,
                  upsert: true,
                })
            )
          ),
        ]
      )

      // Create user roles
      await UserRole.findOneAndUpdate(
        { user: users._id },
        {
          user: users._id,
          role: roles[0]._id,
        },
        {
          new: true,
          upsert: true,
        }
      )

      // Find super admin role
      const superAdminRole = roleObj.find((r) => r.type === 'SUPER_ADMIN')

      // Create permissions for super admin role
      superAdminRole.permission = permissionsObj.map((p) => p._id)

      // create client permissions for super admin role
      superAdminRole.clientPermission = clientPermissionsObj.map((p) => p._id)

      res.status(200).json({
        message: 'Database seeded successfully',
        users: await User.countDocuments({}),
        profiles: await Profile.countDocuments({}),
        permissions: await Permission.countDocuments({}),
        clientPermissions: await ClientPermission.countDocuments({}),
        roles: await Role.countDocuments({}),
        userRoles: await UserRole.countDocuments({}),
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
