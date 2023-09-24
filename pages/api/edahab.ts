import nc from 'next-connect'
import { useCreateInvoice, useVerifyInvoice } from '../../hook/useEDahabPayment'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const createInvoice = await useCreateInvoice('628237779', 0.01)

      console.log('CREATE: ', createInvoice)

      await new Promise((resolve) => setTimeout(resolve, 5000))

      if (createInvoice?.StatusCode !== 0)
        return res.status(400).json({ error: createInvoice?.StatusDescription })

      const verifyInvoice = await useVerifyInvoice(createInvoice.InvoiceId)

      console.log('VERIFY: ', verifyInvoice)

      const link = `https://edahab.net/api/payment?invoiceId=${createInvoice.InvoiceId}`

      res.status(200).json({ message: `success`, link })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
