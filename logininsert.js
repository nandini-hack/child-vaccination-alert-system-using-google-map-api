// insertUser .js
const db = require('./login.js');

db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['testuser', 'testpassword'], function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.close();

