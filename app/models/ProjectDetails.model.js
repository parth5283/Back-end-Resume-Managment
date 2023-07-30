const Employee = require("./employee.model.js");
module.exports = (sequelize, Sequelize) => {
    const projectDetails = sequelize.define("employeeprojectdetails", {
        employeeid: {
            type: Sequelize.INTEGER,
            references: {
              model: "employeepersonaldetails",
              key: "employeeid",
              onDelete: "CASCADE"
            }
          },
          projectid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          projectname: {
            type: Sequelize.STRING
          },
          startdate: {
            type: Sequelize.DATE
          },
          enddate: {
            type: Sequelize.DATE
          },
          technologiesused: {
            type: Sequelize.STRING
          },
          rolesandresponsibilities: {
            type: Sequelize.TEXT
          },
          projectdescription: {
            type: Sequelize.TEXT
          }
    
        }, {
          timestamps: false
        });
      
  
    return projectDetails;
  };