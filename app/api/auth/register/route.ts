import { encryptPassword, generateToken, getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword, address, bio, mobile } =
      await req.json()

    if (password !== confirmPassword)
      return getErrorResponse('Password does not match', 400)

    const user =
      email &&
      (await prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      }))
    if (user) return getErrorResponse(`Email ${email} already exists`, 409)

    const userObj = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        confirmed: true,
        blocked: false,
        address,
        bio,
        mobile: Number(mobile),
        roleId: 'a75POUlJzMDmaJtz0JCxp',
        image: `https://ui-avatars.com/api/?uppercase=true&name=${name}&background=random&color=random&size=128`,
        password: await encryptPassword({ password }),
      },
    })

    if (!userObj) return getErrorResponse('User not created', 400)

    const role =
      userObj.roleId &&
      (await prisma.role.findFirst({
        where: {
          id: userObj.roleId,
        },
        include: {
          clientPermissions: {
            select: {
              menu: true,
              sort: true,
              path: true,
              name: true,
            },
          },
        },
      }))

    if (!role) return getErrorResponse('Role not found', 404)

    const routes = role.clientPermissions

    interface Route {
      menu?: string
      name?: string
      path?: string
      open?: boolean
      sort?: number
    }
    interface RouteChildren extends Route {
      children?: { menu?: string; name?: string; path?: string }[] | any
    }
    const formatRoutes = (routes: Route[]) => {
      const formattedRoutes: RouteChildren[] = []

      routes.forEach((route) => {
        if (route.menu === 'hidden') return null
        if (route.menu === 'profile') return null

        if (route.menu === 'normal') {
          formattedRoutes.push({
            name: route.name,
            path: route.path,
            sort: route.sort,
          })
        } else {
          const found = formattedRoutes.find((r) => r.name === route.menu)
          if (found) {
            found.children.push({ name: route.name, path: route.path })
          } else {
            formattedRoutes.push({
              name: route.menu,
              sort: route.sort,
              open: false,
              children: [{ name: route.name, path: route.path }],
            })
          }
        }
      })

      return formattedRoutes
    }

    const sortMenu: any = (menu: any[]) => {
      const sortedMenu = menu.sort((a, b) => {
        if (a.sort === b.sort) {
          if (a.name < b.name) {
            return -1
          } else {
            return 1
          }
        } else {
          return a.sort - b.sort
        }
      })

      return sortedMenu.map((m) => {
        if (m.children) {
          return {
            ...m,
            children: sortMenu(m.children),
          }
        } else {
          return m
        }
      })
    }

    return NextResponse.json({
      id: userObj.id,
      name: userObj.name,
      email: userObj.email,
      blocked: userObj.blocked,
      confirmed: userObj.confirmed,
      image: userObj.image,
      role: role.type,
      routes,
      menu: sortMenu(formatRoutes(routes) as any[]),
      token: await generateToken(userObj.id),
      message: 'User has been created and logged in successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
