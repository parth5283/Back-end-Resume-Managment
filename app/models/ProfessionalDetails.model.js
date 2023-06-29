const Employee = require("./employee.model.js");
module.exports = (sequelize, Sequelize) => {
    const skillDetails = sequelize.define("employeeprofessionaldetails", {
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
          certficationdate: {
            type: Sequelize.DATE
          },
          certficationexpirydate: {
            type: Sequelize.DATE
          },
          technicalskills: {
            type: Sequelize.STRING
          }
        });
      
  
    return skillDetails;
  };