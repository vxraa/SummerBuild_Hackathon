require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createSignature } = require('./veryfihelper');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(authRoutes); // /api/register and /api/login

// Your existing scan route
app.post('/api/scan', async (req, res) => {
  const payload = req.body;
  const timestamp = Date.now();
  const signature = createSignature(process.env.VERYFI_CLIENT_SECRET, payload, timestamp);

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
    );
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message, detail: err.response?.data });
  }
});

// Start the server (one port only)
app.listen(3000, "192.168.1.153", () => {
  console.log('Backend running on http://localhost:3000');
});
``
