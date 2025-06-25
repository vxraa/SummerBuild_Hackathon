const express = require('express');
const router = express.Router();
const {insertScan}= require('./userDB')


// Define insertScan function

router.post('/api/scan', (req, res) => {
  const { user_id, vendor, date, total, category, full_data } = req.body;

  if (!user_id || !vendor || !date || !total || !category ||!full_data) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = insertScan(user_id, vendor, date, total, category, full_data);
    res.status(201).json({ message: 'Scan saved', id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


