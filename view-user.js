const Database = require('better-sqlite3');
const db = new Database('./users2.db'); // Path to your .db file

const users = db.prepare('SELECT * FROM users').all();
console.table(users);
