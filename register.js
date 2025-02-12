const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 8080;

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up SQLite database
const db = new sqlite3.Database('users.db'); // Use a file-based database

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_name TEXT, child_name TEXT, child_dob TEXT, email TEXT, phone TEXT, password TEXT)");
});

// Handle user registration
app.post('/register', (req, res) => {
  const { parent_name, child_name, child_dob, email, phone, password } = req.body;
  const stmt = db.prepare("INSERT INTO users (parent_name, child_name, child_dob, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)");
  stmt.run(parent_name, child_name, child_dob, email, phone, password, (err) => {
    if (err) {
      return res.status(500).send("Error registering user");
    }
    res.send("User registered successfully");
  });
  stmt.finalize();
});

// Endpoint to retrieve users (for verification purposes)
app.get('/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Error retrieving users");
    }
    res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:8080/register.html`);
});