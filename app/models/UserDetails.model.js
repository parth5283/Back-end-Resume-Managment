module.exports = (sequelize, Sequelize) => {
    const userDetails = sequelize.define("userdetails", {
      userid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return userDetails;
  };