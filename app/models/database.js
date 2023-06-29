const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
 

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./employee.model.js")(sequelize, Sequelize);
db.tutorials = require("./ProfessionalDetails.model.js")(sequelize, Sequelize);
db.tutorials = require("./ProjectDetails.model.js")(sequelize, Sequelize);
db.tutorials = require("./UserDetails.model.js")(sequelize, Sequelize);
module.exports = db;