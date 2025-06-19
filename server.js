require('dotenv').config()
console.log('Server file loaded...');
const express = require('express')
const axios = require('axios')
const { createSignature } = require('./veryfiHelper')

const app = express()
app.use(express.json())

app.post('/api/scan', async (req, res) => {
  const payload = req.body
  const timestamp = Date.now()
  const signature = createSignature(process.env.VERYFI_CLIENT_SECRET, payload, timestamp)

  try {
    const result = await axios.post(
      'https://api.veryfi.com/api/v8/partner/documents/',
      payload,
      {
        headers: {
          'X-VERYFI-REQUEST-TIMESTAMP': timestamp.toString(),
          'X-VERYFI-REQUEST-SIGNATURE': signature,
          'CLIENT-ID': process.env.VERYFI_CLIENT_ID,
          Authorization: `apikey ${process.env.VERYFI_API_KEY}`,
        }
      }
    )
    res.json(result.data)
  } catch (err) {
    res.status(500).json({ error: err.message, detail: err.response?.data })
  }
})

app.listen(3001, () => console.log('Backend running on http://localhost:3001'))