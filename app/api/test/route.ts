import { getErrorResponse } from '@/lib/helpers'
import { ipAuthMiddleware } from '@/lib/ipAuthMiddleware'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    return NextResponse.json(ipAuthMiddleware(req))
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
