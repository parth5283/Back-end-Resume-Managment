const pool = require('../../db');
const queries = require('./queries');
const cors = require("cors");
const PDFDocument = require('pdfkit');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());

const getEmployeeDetails = (req, res) =>
{
  pool.query(queries.getEmployee,(error,results) => {
    if(error) throw error;
    res.status(200).json(results.rows);
  })
};

const getEmployeeById  = (req, res) =>
{
    const id = parseInt(req.params.id);
    pool.query(queries.getEmployeeById,[id],(error,results) => {
        if(error) {
          console.log(error);
        }
        res.status(200).json(results.rows)})
};
app.use(bodyParser.json());
const addEmployee = (req, res) => {
    console.log(req.body);
    const { name, email, phonenumber, address, zipcode, profilesummary } = req.body;
  
    // check if email exists
    pool.query(queries.checkEmailExists, [email], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send('An error occurred');
      }
  
      if (results.rows.length) {
        return res.send('Email already exists');
      }
  
      // add employee to db
      pool.query(
        queries.addEmployee,
        [name, email, phonenumber, address, zipcode, profilesummary],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).send('An error occurred');
          }
       
    });
 } )};
 const getProjectDetails = (req, res) =>
{
  pool.query(queries.getProjects,(error,results) => {
    if(error) throw error;
    res.status(200).json(results.rows);
  })
};
 const addProjectDetails = (req, res) => {
  console.log(req.body);
  const {projectname,startdate,enddate,technologiesused,rolesandresponsibilities,projectdescription } = req.body;

  

    // add project to db
    pool.query(
      queries.addProjectDetails,
      [projectname,startdate,enddate,technologiesused,rolesandresponsibilities,projectdescription],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send('An error occurred');
        }
     
  });
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

const updateEmployee=(req,res) =>
{
    const id = parseInt(req.params.id);
    const{name,email} = req.body;

    pool.query(queries.getEmployeeById, [id],(error,results) => {
        const noEmployeeFound = !results.rows.length;
        if(noEmployeeFound){
            res.send("Employee does not exist in db"); 
        }
        pool.query(queries.updateEmployee,[name,email,id],(error,results) => {
            if(error) 
                {
                       console.log(error);
                }
                else{
                    res.status(200).send("Employee Updated Successfully");
                }
        });
    }
    );

}




module.exports ={
    getEmployeeDetails,getEmployeeById,addEmployee,removeEmployee,updateEmployee,addProjectDetails,getProjectDetails,
};
