const Database = require('better-sqlite3');
const userDB = new Database('users2.db');

// Create the users table if it doesn't exist
userDB.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

module.exports = userDB;