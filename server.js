
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createSignature } = require('./veryfihelper');
const authRoutes = require('./routes/auth');
const { URL } = require('./config');
const {insertScan}= require('./userDB')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.get('/api', (req, res) => {
  res.send('API is running');
});

app.use('/', require('./routes/auth'));


app.post('/api/scan', async (req, res) => {
  const { user_id, vendor, date, total, category, full_data } = req.body;

  // Optional: you can validate these fields before continuing
  if (!user_id || !vendor || !date || !total || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save scan to your database
    const result = insertScan.run(user_id, vendor, date, total, category, full_data);
    const scanId = result.lastInsertRowid;

    // Optionally: If you still want to call Veryfi API from backend, put it here.
    // (But usually, this should already have been done from the frontend.)

    // Respond success
    res.status(201).json({ success: true, scanId });
  } catch (err) {
    console.error('Error saving to DB:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server (one port only)
app.listen(8081, URL, () => {
  console.log('Backend running on http://localhost:8081')
});
``
