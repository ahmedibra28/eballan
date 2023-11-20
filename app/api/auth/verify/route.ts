import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { generateToken, getErrorResponse } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    const { verifyToken } = await req.json()

    if (!verifyToken) return getErrorResponse('Invalid request', 401)

    const verificationToken = crypto
      .createHash('sha256')
      .update(verifyToken)
      .digest('hex')

    const user =
      verifyToken &&
      (await prisma.user.findFirst({
        where: {
          verificationToken,
          verificationExpire: { gt: Date.now() },
        },
      }))

    if (!user) return getErrorResponse('Invalid token or expired', 401)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: null,
        verificationExpire: null,
        confirmed: true,
      },
    })

    const role =
      user.roleId &&
      (await prisma.role.findFirst({
        where: {
          id: user.roleId,
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
      id: user.id,
      name: user.name,
      email: user.email,
      blocked: user.blocked,
      confirmed: user.confirmed,
      image: user.image,
      role: role.type,
      routes,
      menu: sortMenu(formatRoutes(routes) as any[]),
      token: await generateToken(user.id),
      message: 'User has been verified and logged in successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
