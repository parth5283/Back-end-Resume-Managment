module.exports = (sequelize, Sequelize) => {
    const personalDetails = sequelize.define("employeepersonaldetails", {
      employeeid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phonenumber: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.STRING
      },
      profilesummary: {
        type: Sequelize.TEXT
      },
    
      resumefile:{
        type: Sequelize.BLOB
      }
    });
  
    return personalDetails;
  };