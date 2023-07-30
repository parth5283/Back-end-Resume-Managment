const empDetailsRouter = require("./src/employees/routes")
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require('./db');
const app = express();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const PDFParser = require('pdf-parse');

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/v1/employees", empDetailsRouter);
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models/database");
db.sequelize.sync().then(() => {
  console.log("Re-sync db.");
});

// Login 
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }


  pool.query('SELECT username,password FROM userdetails WHERE username = $1 AND password = $2', [username, password], (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return res.status(200).json({ message: 'Login successful' });
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});