module.exports = {
    HOST: "18.116.50.68",
    USER: "postgres",
    PASSWORD: "password123",
    DB: "resumes",
    dialect: "postgres",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };