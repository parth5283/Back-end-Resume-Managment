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

//app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



app.use("/api/v1/employees", empDetailsRouter);
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models/database");
db.sequelize.sync().then(() => {
    console.log("Re-sync db.");
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Validate username and password
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    console.log(username);
    console.log(password);
  
    // Perform login logic (e.g., check against database)
    pool.query('SELECT username,password FROM userdetails WHERE username = $1 AND password = $2', [username, password], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Login successful
      return res.status(200).json({ message: 'Login successful' });
    });
  });
 // API endpoint to save the PDF
 app.post('api/v1/employees/save-pdf', async (req, res) => {
  // Access the PDF data from the request body or form data
  const pdfData = req.body.pdfData;

  try {
    // Save the PDF data to the database
    const client = await pool.connect();
    await client.query('INSERT INTO employeepersonaldetails (resumefile) VALUES ($1)', [pdfData]);
    client.release();

    // Return a response indicating success
    res.status(200).send('PDF saved successfully');
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).send('Error saving PDF');
  }
});
  
  
  
  
  
  





  app.get('/generate-pdf', (req, res) => {
    // Fetch the form data from the database
    const query = 'SELECT * FROM employeepersonaldetails WHERE employeeid = $1';
    const employeeId = req.query.employeeId; // Assuming you pass the employee ID as a query parameter
    pool.query(query, [employeeId], (error, results) => {
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'An error occurred' });
      }
      
      const formData = results.rows[0];
  
      if (!formData) {
        console.error('Form data not found');
        return res.status(404).json({ error: 'Form data not found' });
      }
  
      // Create a new PDF document
      const doc = new PDFDocument();
      const buffers = [];
  
      // Generate the PDF content
      doc.fontSize(20).text('Form Data', { align: 'center' });
      doc.fontSize(16);
      doc.text(`Name: ${formData.name}`);
      doc.text(`Email: ${formData.email}`);
      doc.text(`Phone Number: ${formData.phonenumber}`);
      doc.text(`Address: ${formData.address}`);
      doc.text(`Zip Code: ${formData.zipcode}`);
      doc.text(`Profile Summary: ${formData.profilesummary}`);
      doc.moveDown(1);
  
      // Collect the buffers as they are created
      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
  
        // Update the table column with the binary PDF data
        const updateQuery = 'UPDATE employeepersonaldetails SET resumefile = $1 WHERE employeeid = $2';
        pool.query(updateQuery, [pdfData, employeeId], (updateError, updateResult) => {
          if (updateError) {
            console.error('Error updating PDF data:', updateError);
            return res.status(500).json({ error: 'An error occurred' });
          }
          console.log('PDF saved successfully');
          res.sendStatus(200);
        });
      });
  
      // End the document to trigger the 'end' event
      doc.end();
    });
  });
  app.get('/pdf-link', (req, res) => {
    const query = 'SELECT resumefile FROM employeepersonaldetails';
    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching PDF data:', error);
        return res.status(500).json({ error: 'An error occurred' });
      }
  
      const pdfData = results.rows[0].resumefile;
  
      if (!pdfData) {
        console.error('PDF data not found');
        return res.status(500).json({ error: 'PDF data not found' });
      }
  
      // Convert the binary data to base64
      const base64Data = pdfData.toString('base64');
      const link = `<a href="/pdf-generator?data=${encodeURIComponent(base64Data)}" target="_blank">Open PDF</a>`;
      res.send(link);
    });
  });

  app.get('/pdf-generator/:employeeid', (req, res) => {
    const employeeId = req.params.employeeId;
    const query = 'SELECT resumefile FROM employeepersonaldetails WHERE employeeid = $1';
    
    pool.query(query, [employeeId], (error, results) => {
      if (error) {
        console.error('Error fetching PDF data:', error);
        return res.status(500).json({ error: 'An error occurred' });
      }
    
      const pdfData = results.rows[0]?.resumefile;
    
      if (!pdfData) {
        console.error('PDF data not found');
        return res.status(500).json({ error: 'PDF data not found' });
      }
    
      // Set the response headers for PDF content
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="formdata.pdf"');
    
      // Send the PDF data as the response
      res.send(pdfData);
    });
  });


 
app.get('/check-pdf-data', (req, res) => {
  const query = 'SELECT resumefile FROM employeepersonaldetails';
  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching binary data:', error);
      return res.status(500).json({ error: 'An error occurred' });
    }

    const binaryData = results.rows[0].resumefile;

    if (!binaryData) {
      console.error('Binary data not found');
      return res.status(500).json({ error: 'Binary data not found' });
    }

    // Convert the binary data to a string for display
    const binaryString = binaryData.toString();

    // Send the binary data as the response
    res.send(binaryString);
  });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});