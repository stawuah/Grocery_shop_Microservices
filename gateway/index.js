const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')
const app = express()

const PORT = 4000

app.use(cors())
app.use(express.json())


app.use('/customer', proxy('http://localhost:4001'))
app.use('/shopping', proxy('http://localhost:4003'))
app.use('/', proxy('http://localhost:4002'))

app.listen(PORT, () => {
    console.log(`gateway m1 is on ${PORT}`)
})