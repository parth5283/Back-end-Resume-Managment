const Employee = require("./employee.model.js");
module.exports = (sequelize, Sequelize) => {
    const skillDetails = sequelize.define("certificateandskillsdetails", {
        employeeid: {
            type: Sequelize.INTEGER,
            references: {
              model: "employeepersonaldetails",
              key: "employeeid"
            }
          },
          professionaldetailsid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          certificationname: {
            type: Sequelize.STRING
          },
          certificationdate: {
            type: Sequelize.DATE
          },
          certificationexpirydate: {
            type: Sequelize.DATE
          },
          technicalskills: {
            type: Sequelize.STRING
          }
        }, {
          timestamps: false 
        });
      
  
    return skillDetails;
  };