const db = require('./db'); // Your existing db.js file

const users = db.prepare('SELECT * FROM users').all();
console.table(users);
