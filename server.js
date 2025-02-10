// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./login.js');
const bcrypt = require("bcryptjs");


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('login'));

const SECRET_KEY = "your_secret_key"; // Change this in production

// User Registration (Run once to create an account)
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) return res.status(400).json({ error: "User already exists" });
        res.json({ message: "User registered successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:8080/login.html`);
});

// Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: "Invalid username or password" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ error: "Invalid username or password" });

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    });
});

