const pool = require('../../db');
const queries = require('./queries');
const cors = require("cors");
const PDFDocument = require('pdfkit');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());

const getEmployeeDetails = (req, res) => {
  pool.query(queries.getEmployee, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  })
};

const getEmployeeById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getEmployeeById, [id], (error, results) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(results.rows)
  })
};

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const addEmployee = async (req, res) => {
  try {
    const { name, email, phonenumber, address, zipcode, profilesummary } = req.body;

    // Check if email exists
    const checkEmailExistsResult = await pool.query(queries.checkEmailExists, [email]);
    if (checkEmailExistsResult.rows.length) {
      return res.send('Email already exists');
    }

    // Add employee to db
    const addEmployeeResult = await pool.query(queries.addEmployee, [
      name,
      email,
      phonenumber,
      address,
      zipcode,
      profilesummary,
    ]);

    console.log('Employee added successfully. Employee ID:', addEmployeeResult.rows[0].employeeid);
    return res.send({
      message: 'Employee added successfully',
      employeeId: addEmployeeResult.rows[0].employeeid
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('An error occurred');
  }
};

const getProjectDetails = (req, res) => {
  pool.query(queries.getProjects, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  })
};
const addCertificateDetails = (req, res) => {
  const { certificates } = req.body;
  console.log("certificates:", certificates);
  certificates.forEach((certificate) => {
    const {
      employeeId,
      certificate: {
        certificationname: certificationname,
        certificationdate: certificationdate,
        certificateexpirydate: certficationexpirydate,
        technicalskills: technicalskills,
      }
    } = certificate;
    console.log("certificate:", certificate);
    pool.query(
      queries.addCertificateDetails,
      [employeeId, certificate.certificate.certificationname,
        certificate.certificate.certificationdate,
        certificate.certificate.certificationexpirydate,
        certificate.certificate.technicalskills,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send('An error occurred');
        }
      }
    );
  });

  res.status(200).send('Certificate and skills added successfully');
}
const addProjectDetails = (req, res) => {
  const { projects } = req.body;

  console.log("projects:", projects);
  projects.forEach((project) => {
    const {
      employeeId,
      project: {
        name: projectname,
        startDate: startdate,
        endDate: enddate,
        technologiesUsed: technologiesused,
        rolesAndResponsibilities: rolesandresponsibilities,
        projectDescription: projectdescription,
        // Include other project properties
      }
    } = project;

    console.log("project:", project);
    // Add project to the database using your desired method (e.g., using pool.query)
    pool.query(
      queries.addProjectDetails,
      [employeeId, project.project.projectname,
        project.project.startdate,
        project.project.enddate,
        project.project.technologiesused,
        project.project.rolesandresponsibilities,
        project.project.projectdescription],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send('An error occurred');
        }
      }
    );
  });

  res.status(200).send('Projects added successfully');
};

const getUserDetails = (req, res) => {
  pool.query(queries.getUser, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  })
};
// Delete employee from database
const removeEmployee = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send("Invalid employee ID");
  }

  pool.query(queries.getEmployeeById, [id], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send("An error occurred");
    }

    const noEmployeeFound = !results || !results.rows || results.rows.length === 0;
    if (noEmployeeFound) {
      return res.status(404).send("Employee does not exist in the database");
    }

    pool.query(queries.removeEmployee, [id], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send("An error occurred");
      }

      res.status(200).send("Employee Removed Successfully");
    });
  });
};

const updateEmployee = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  pool.query(queries.getEmployeeById, [id], (error, results) => {
    const noEmployeeFound = !results.rows.length;
    if (noEmployeeFound) {
      res.send("Employee does not exist in db");
    }
    pool.query(queries.updateEmployee, [name, email, id], (error, results) => {
      if (error) {
        console.log(error);
      }
      else {
        res.status(200).send("Employee Updated Successfully");
      }
    });
  }
  );

}


const savePDFToDatabase = async (req, res) => {
  try {
    const employeeId = req.body.employeeId;
    const pdfData = req.body.pdfData;

    const client = await pool.connect();
    console.log("req",req.body);
    console.log("employeeId",employeeId);
    await client.query('UPDATE employeepersonaldetails SET resumefile = $1 WHERE employeeid = $2', [pdfData, employeeId]);
    client.release();

    res.status(200).send('PDF saved to database successfully');
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).send('Error saving PDF to database');
  }
};

const getResumeFile = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send("Invalid employee ID");
  }

  pool.query(queries.getResumeFile, [id], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send("An error occurred");
    }

    const noEmployeeFound = !results || !results.rows || results.rows.length === 0;
    if (noEmployeeFound) {
      return res.status(404).send("Employee does not exist in the database");
    }

    const resumeFile = results.rows[0].resumefile;
    res.setHeader('Content-Type', 'application/pdf');
    res.send(resumeFile);
  });
};
module.exports = {
  getEmployeeDetails, getEmployeeById, addEmployee, removeEmployee, updateEmployee,
  addProjectDetails, getProjectDetails, getUserDetails, addCertificateDetails,savePDFToDatabase,getResumeFile
};
