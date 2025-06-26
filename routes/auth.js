const express = require('express');
const { db } = require('../userDB');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authenticateToken.js')
require('dotenv').config();



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
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Exclude password from response
  const { password: _, ...safeUser } = user;
  const SECRET_KEY = process.env.JWT_SECRET;


  // ✅ Generate JWT token
  const token = jwt.sign(
    { id: safeUser.id, email: safeUser.email }, // payload
    SECRET_KEY,
    { expiresIn: '1d' } // optional: expires in 1 day
  );

  // ✅ Send back user and token
  res.json({ user: safeUser, token });
});

// route for user data
router.get("/api/user/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;

  try {
    const stmt = db.prepare("SELECT id, firstname, lastname, email, phone, gender, dob, budget FROM users WHERE id = ?");
    const user = stmt.get(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("userdata from auth:", user);

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

//route for expenses
// POST - Set user's budget
router.post("/api/users/:id/budget", authenticateToken, (req, res) => {

  const userId = parseInt(req.params.id);
  console.log("userId: ", userId);
  const { budget } = req.body;
  console.log("budget", budget);

  if (!budget && budget !== 0) {
    return res.status(400).json({ message: "Budget is required" });
  }

  try {
    const stmt = db.prepare("UPDATE users SET budget = ? WHERE id = ?");
    const result = stmt.run(budget, userId);

    if (result.changes === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Budget updated successfully", budget });
  } catch (err) {
    console.error("Error setting budget:", err);
    res.status(500).json({ message: "Failed to update budget" });
  }
});

//route for budget
router.get("/api/users/:id/budget", authenticateToken, (req, res) => {
  const userId = req.params.id;

  const stmt = db.prepare("SELECT budget FROM users WHERE id = ?");
  const result = stmt.get(userId);

  if (!result) {
    return res.status(404).json({ message: "Budget not found" });
  }

  res.json(result.budget); // or: res.json({ budget: result.budget })
});
//route for get expenses
router.get("/api/users/:id/expenses", authenticateToken, (req, res) => {
  const userId = req.params.id;

  try {
    const stmt = db.prepare("SELECT * FROM scans WHERE user_id = ?");
    const expenses = stmt.all(userId);

    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});
//route for post expenses
// Add authenticateToken middleware and fix field names
router.post("/api/users/:id/expenses", authenticateToken, (req, res) => {
  try {
    // First log the complete request body
    console.log("Received request body:", req.body);
    
    // Destructure with proper error handling
    const { vendor, total, date, category } = req.body;
    const userId = req.params.id;

    // Validate required fields exist in the request
    if (!vendor || !total || !date || !category) {
      return res.status(400).json({ 
        message: "Missing required fields",
        received: req.body
      });
    }

    const stmt = db.prepare(`
      INSERT INTO scans (user_id, vendor, date, total, category) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(userId, vendor, date, total, category);

    res.status(201).json({
      success: true,
      id: result.lastInsertRowid,
      user_id: userId,
      vendor,
      total,
      date,
      category
    });
    
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ 
      message: "Failed to create expense",
      error: err.message 
    });
  }
});


// Update user profile
router.post("/api/user/:id/profile", authenticateToken, async (req, res) => {
  try {
    const { firstname, lastname, email, phone, gender, dob } = req.body;
    const userId = req.params.id;

    // Email check with prepared statement
     const emailCheckStmt = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?");
  const emailCheck = emailCheckStmt.all(email, userId); // Proper parameter binding

   if (emailCheck.length > 0) {
    return res.status(400).json({ message: "Email already in use" });
  }

    const updateStmt = db.prepare(`
    UPDATE users SET 
      firstname = ?, 
      lastname = ?, 
      email = ?, 
      phone = ?, 
      gender = ?, 
      dob = ?
    WHERE id = ?
  `);
  
  const updateResult = updateStmt.run(firstname, lastname, email, phone, gender, dob, userId);

  if (updateResult.changes === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  // 5. Get updated user
  const userStmt = db.prepare(`
    SELECT 
      id, 
      firstname, 
      lastname, 
      email, 
      phone, 
      gender, 
      dob
    FROM users 
    WHERE id = ?
  `);
  
  const updatedUser = userStmt.get(userId);

  res.json({ success: true, user: updatedUser });
   } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ 
      message: "Server error during profile update",
      error: err.message 
    });
   }
  });

module.exports = router;
