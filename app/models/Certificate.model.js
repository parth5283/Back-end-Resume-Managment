const Employee = require("./employee.model.js");
module.exports = (sequelize, Sequelize) => {
    const certificateDetails = sequelize.define("certificatedetails", {
        employeeid: {
            type: Sequelize.INTEGER,
            references: {
              model: "employeepersonaldetails",
              key: "employeeid"
            }
          },
          certificationid: {
            type: Sequelize.INTEGER,
            primaryKey: true
          },
          certicationdetails: {
            type: Sequelize.STRING
          }
        });
      
  
    return certificateDetails;
  };