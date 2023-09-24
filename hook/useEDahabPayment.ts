import axios from 'axios'
import { sha256 } from 'js-sha256'

type CreateInvoice = {
  InvoiceId: number
  StatusCode: number
  RequestId: number
  StatusDescription: string
  ValidationErrors: null
}

type VerifyInvoice = {
  InvoiceStatus: 'Pending' | 'Paid'
  TransactionId: null
  InvoiceId: number
  StatusCode: 0 | 1 | 2 | 3 | 4 | 5 | 6
  RequestId: number
  StatusDescription: string
  ValidationErrors: null
}

type CreditAccount = {
  apiKey: string
  phoneNumber: string
  transactionAmount: number
  currency?: string
  transactionId: string
}

const client = axios.create({
  baseURL: 'https://edahab.net/api/api/',
})
const { EDAHAB_API_KEY, EDAHAB_HASHED } = process.env
const apiKey = EDAHAB_API_KEY
const hashed = EDAHAB_HASHED

export const useCreateInvoice = async (
  edahabNumber: string,
  amount: number,
  returnUrl = 'https://eballan.com'
): Promise<CreateInvoice> => {
  try {
    const request = {
      apiKey,
      edahabNumber,
      amount,
      agentCode: '094972',
      returnUrl,
    }

    const json = JSON.stringify(request)
    const hash = sha256(json + hashed)
    const url = `IssueInvoice?hash=${hash}`

    const { data } = await client.post(url, json, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const useVerifyInvoice = async (
  invoiceId: number
): Promise<VerifyInvoice> => {
  try {
    const request = {
      apiKey,
      invoiceId,
    }

    const json = JSON.stringify(request)
    const hash = sha256(json + hashed)
    const url = `CheckInvoiceStatus?hash=${hash}`

    const { data } = await client.post(url, json, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return data
  } catch (error: any) {
    return error?.response?.data
  }
}

// I have not tested this function yet!
export const useCreditAccount = async (
  phoneNumber: string,
  transactionAmount: string,
  currency?: string
): Promise<CreditAccount> => {
  try {
    const request = {
      apiKey,
      phoneNumber,
      transactionAmount,
      currency,
      transactionId: Math.floor(100000 + Math.random() * 900000),
    }

    const json = JSON.stringify(request)
    const hash = sha256(json + hashed)
    const url = `agentPayment?hash=${hash}`

    const { data } = await client.post(url, json, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return data
  } catch (error: any) {
    return error?.response?.data
  }
}
