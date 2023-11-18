import { getErrorResponse } from './helpers'

export const ipAuthMiddleware = (req: Request) => {
  const allowedIPs = ['192.168.100.100']
  let shouldDisallowAccess = true
  const ip = req.headers.get('x-forwarded-for') as string

  if (!allowedIPs.includes(ip)) {
    shouldDisallowAccess = false
  }

  if (shouldDisallowAccess) return getErrorResponse(`Not allowed ${ip}`, 403)

  return { shouldDisallowAccess, ip }
}
