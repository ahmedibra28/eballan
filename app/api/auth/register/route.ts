import {
  encryptPassword,
  getErrorResponse,
  getResetPasswordToken,
} from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import DeviceDetector from 'device-detector-js'
import { verifyTemplate } from '@/lib/verifyTemplate'
import { sendEmail } from '@/lib/nodemailer'

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
        confirmed: false,
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

    const host = req.headers.get('host') // localhost:3000
    const protocol = req.headers.get('x-forwarded-proto') // http
    const token = await getResetPasswordToken({ minute: 525600 }) // 1 year

    await prisma.user.update({
      where: { id: userObj.id },
      data: {
        verificationToken: token.resetPasswordToken,
        verificationExpire: token.resetPasswordExpire,
      },
    })

    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(
      req.headers.get('user-agent') || ''
    ) as any

    const {
      client: { type: clientType, name: clientName },
      os: { name: osName },
      device: { type: deviceType, brand },
    } = device

    const message = verifyTemplate({
      url: `${protocol}://${host}/auth/verify?token=${token.resetToken}`,
      user: userObj.name,
      clientType,
      clientName,
      osName,
      deviceType,
      brand,
      webName: 'eBallan',
      validTime: '1 Year',
      addressStreet: 'Makka Almukarrama',
      addressCountry: 'Mogadishu - Somalia',
    })

    const result = await sendEmail({
      to: userObj.email,
      subject: 'Verify your email',
      text: message,
      webName: 'eBallan Team',
    })

    if (!result) return getErrorResponse('Verification email not sent', 400)

    return NextResponse.json({
      message: `An email has been sent to ${email} with further instructions.`,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
