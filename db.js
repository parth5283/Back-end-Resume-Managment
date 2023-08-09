const Pool = require("pg").Pool;

const pool = new Pool({
    host: "18.116.50.68",
    user: "postgres",
    password: "password123",
    database: "resumes",
    port:5432,
});

module.exports=pool;