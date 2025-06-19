const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  try {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, password);
    res.status(201).json({ id: result.lastInsertRowid, name, email });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
  const user = stmt.get(email, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

module.exports = router;
