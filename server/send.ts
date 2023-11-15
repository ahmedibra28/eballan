'use server'

import { sendEmail } from '@/lib/nodemailer'

export default async function send({
  base64,
  to,
  subject,
  text,
}: {
  base64: string
  to: string
  subject: string
  text: string
}) {
  try {
    return await sendEmail({
      to,
      subject,
      text,
      webName: 'eBallan Team',
      attachments: true,
      data: base64,
    })
  } catch (error: any) {
    throw new Error(`${error?.message}`)
  }
}
