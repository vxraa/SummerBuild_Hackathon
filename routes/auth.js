const express = require('express');
const { db } = require('../userDB');
const router = express.Router();



router.post('/api/register', (req, res) => {
    console.log("Received registration request:", req.body);
    const { firstname, lastname, email, password } = req.body;
  
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const stmt = db.prepare('INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)');
      const result = stmt.run(firstname, lastname, email, password);
      res.status(201).json({ id: result.lastInsertRowid, firstname, lastname, email });
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ message: 'Email already in use' });
      }
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  });

router.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
  const user = stmt.get(email, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' }); //if email is not yet registered
  }

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

module.exports = router;
