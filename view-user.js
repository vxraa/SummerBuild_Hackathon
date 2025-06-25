const Database = require('better-sqlite3');
const { db }= require('./userDB');

const users = db.prepare('SELECT * FROM users').all();
const scans = db.prepare('SELECT * FROM scans').all();
console.table(users);
console.table(scans);
