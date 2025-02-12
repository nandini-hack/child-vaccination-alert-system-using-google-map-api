const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Change this to your MySQL username
    password: 'Raje@2004',      // Add your MySQL password
    database: 'dr_alert_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// ✅ POST /login Route (Fix for 404 Error)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length > 0) {
            res.json({ message: '✅ Login successful!', user: results[0] });
        } else {
            res.status(401).json({ error: '❌ Invalid credentials' });
        }
    });
});
app.use((req, res) => {
    res.status(404).json({ error: "❌ Route not found" });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
