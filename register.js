const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path =require('path');
const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.use(express.static('public')); // Serve static files from the 'public' directory

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'Raje@2004', // Your MySQL password
    database: 'child_registration',
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
  });
  
// Registration endpoint
app.post('/register.html', (req, res) => {
    const { parentName, childName, childDob, email, phone, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        // Insert user into the database
        const user = { parent_name: parentName, child_name: childName, child_dob: childDob, email, phone, password: hash };
        const sql = 'INSERT INTO registrations SET ?';
        db.query(sql, user, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error registering user' });
            }
            res.status(201).json({ message: 'Registration successful!' });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:8080/register.html`);
});