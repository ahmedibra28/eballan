import puppeteer from 'puppeteer'

const generatePDF = async (html: any) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/chromium-browser',
  })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })
  const pdf = await page.pdf()
  await browser.close()
  return pdf
}

export default generatePDF
