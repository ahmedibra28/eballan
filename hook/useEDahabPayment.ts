import axios from 'axios'
import { sha256 } from 'js-sha256'

const requestParam = {
  apiKey: '393ydT37wG3JUkRl2VNEhTT9ypyq4cFyMEf5OcHkB',
  edahabNumber: '625158821',
  amount: 1,
  agentCode: '7115',
  returnUrl: 'localhost:3000',
}

// Encode it into a JSON string.
const json = JSON.stringify(requestParam)

const hashed = sha256(json + 'zgvJ3Inz7U51jsoPKCPkP0a1w4CZiE4LpUUn5d')

const url = 'https://edahab.net/sandbox/api/IssueInvoice?hash=' + hashed

export const useEDahabPayment = async () => {
  try {
    const { data } = await axios.post(url, json, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(JSON.stringify(data, null, 2))
  } catch (error: any) {
    console.log(JSON.stringify(error?.message, null, 2))
  }
}
