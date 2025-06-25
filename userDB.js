const Database = require('better-sqlite3');
const userDB = new Database('users.db');

// Create users table
userDB.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

// Create scans table
userDB.prepare(`
  CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    vendor TEXT,
    date TEXT,
    total REAL,
    full_data TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();

// Prepare reusable statements
const insertScan = userDB.prepare(`
  INSERT INTO scans (user_id, vendor, date, total, full_data)
  VALUES (?, ?, ?, ?, ?)
`);

const getUserScans = userDB.prepare(`
  SELECT * FROM scans WHERE user_id = ?
`);

const joinedQuery = userDB.prepare(`
  SELECT s.*, u.firstname, u.lastname, u.email
  FROM scans s
  JOIN users u ON s.user_id = u.id
  WHERE s.user_id = ?
`);

// Export the DB instance and queries
module.exports = {
  db: userDB,
  insertScan,
  getUserScans,
  joinedQuery
};
