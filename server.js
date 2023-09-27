const express = require('express')
const path = require('path')
const http = require('http')
const next = require('next')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
  let app = express()

  const server = http.createServer(app)

  app.use(express.static(path.join(__dirname, './public')))
  app.use('/_next', express.static(path.join(__dirname, './.next')))

  app.all('*', (req, res) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
