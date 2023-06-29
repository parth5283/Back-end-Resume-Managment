const Employee = require("./employee.model.js");
module.exports = (sequelize, Sequelize) => {
    const resumes = sequelize.define("resumesdetails", {
        employeeid: {
            type: Sequelize.INTEGER,
            references: {
              model: "employeepersonaldetails",
              key: "employeeid"
            }
          },
          resumeid: {
            type: Sequelize.INTEGER,
            primaryKey: true
          },
          employeename: {
            type: Sequelize.STRING
          },
          resumefiles: {
            type: Sequelize.STRING
          }
    
        });
      
  
    return resumes;
  };