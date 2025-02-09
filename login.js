const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)");
});

// Handle user registration
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  stmt.run(username, email, password, (err) => {
    if (err) {
      return res.status(500).send("Error registering user");
    }
    res.send("User registered successfully");
  });
  stmt.finalize();
});

// Handle user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) {
      return res.status(500).send("Error logging in");
    }
    if (!row) {
      return res.status(401).send("Invalid username or password");
    }
    res.send("Login successful");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});